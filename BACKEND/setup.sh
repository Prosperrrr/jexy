#!/bin/bash
# =============================================================================
# JEXY Backend Server Setup Script
# Tested on Ubuntu 22.04
# =============================================================================

set -e  # Exit immediately on any error

echo "=== JEXY Server Setup ==="

# ── 1. System packages ─────────────────────────────────────────────────────
echo "[1/5] Installing system packages..."
apt-get update -qq
apt-get install -y \
    ffmpeg \
    python3-pip \
    python3-venv \
    git \
    curl \
    build-essential \
    pkg-config \
    libssl-dev

# ── 2. Rust (required by DeepFilterNet 0.5.6) ─────────────────────────────
echo "[2/5] Installing Rust..."
if ! command -v rustc &> /dev/null; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable
    source "$HOME/.cargo/env"
    echo "Rust installed: $(rustc --version)"
else
    echo "Rust already installed: $(rustc --version)"
fi

# Make cargo available in current shell
export PATH="$HOME/.cargo/bin:$PATH"

# ── 3. Python virtual environment ─────────────────────────────────────────
echo "[3/5] Creating Python virtual environment..."
cd ~/JEXY/BACKEND
python3 -m venv venv
source venv/bin/activate

# ── 4. Python dependencies ─────────────────────────────────────────────────
echo "[4/5] Installing Python requirements..."
pip install --upgrade pip wheel
pip install -r requirements.txt
pip install gunicorn

# ── Fix: pin setuptools to 68.0.0 — newer versions break pkg_resources on Python 3.12 ──
echo "Pinning setuptools to 68.0.0 for Python 3.12 compatibility..."
pip install "setuptools==68.0.0" --force-reinstall
python -c "import pkg_resources; print('  pkg_resources OK')"


# ── Fix: tensorflow_hub uses pkg_resources which is missing in Python 3.12 ──
echo "Patching tensorflow_hub for Python 3.12 compatibility..."
pip install packaging
TF_HUB_INIT=$(python -c "import tensorflow_hub; import os; print(os.path.join(os.path.dirname(tensorflow_hub.__file__), '__init__.py'))")
if grep -q 'from pkg_resources import parse_version' "$TF_HUB_INIT"; then
    sed -i 's/from pkg_resources import parse_version/from packaging.version import parse as parse_version/' "$TF_HUB_INIT"
    echo "  tensorflow_hub patched OK"
else
    echo "  tensorflow_hub already patched or uses different import"
fi

# ── 5. Verify critical packages ────────────────────────────────────────────
echo "[5/5] Verifying installation..."
python -c "import torch; print(f'  torch: {torch.__version__}')"
python -c "import torchaudio; print(f'  torchaudio: {torchaudio.__version__}')"
python -c "import df; print(f'  deepfilternet: OK')"
python -c "import whisper; print(f'  whisper: OK')"
python -c "import demucs; print(f'  demucs: OK')"
python -c "import flask; print(f'  flask: {flask.__version__}')"

echo ""
echo "=== Setup complete! ==="
echo "Next steps:"
echo "  1. Create your .env file: nano ~/JEXY/BACKEND/.env"
echo "  2. Start Redis:  redis-server --daemonize yes"
echo "  3. Start Flask:  nohup gunicorn -w 1 -b 0.0.0.0:5000 --timeout 300 app:app > /var/log/jexy-api.log 2>&1 &"
echo "  4. Start Celery: nohup celery -A celery_app worker --loglevel=info --concurrency=3 > /var/log/jexy-celery.log 2>&1 &"
echo "  5. Start Tunnel: nohup cloudflared tunnel --url http://localhost:5000 --no-autoupdate > /var/log/jexy-tunnel.log 2>&1 &"
echo "  6. Get URL:      grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /var/log/jexy-tunnel.log | tail -1"
