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
echo "  1. Copy your .env file to ~/JEXY/BACKEND/.env"
echo "  2. Run: sudo systemctl daemon-reload"
echo "  3. Run: sudo systemctl enable jexy-celery gunicorn"
echo "  4. Run: sudo systemctl start jexy-celery gunicorn"
