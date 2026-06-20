import os
import sys
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv()

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("Error: Missing Supabase credentials in .env")
    sys.exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# The old legacy Google ID
OLD_USER_ID = "Rt2eBGkEfiNh6qDV2pvQg1hZmQl2"

def migrate(new_user_id):
    print(f"Migrating all jobs from {OLD_USER_ID} to {new_user_id}...")
    
    # Update all rows
    result = supabase.table('jobs').update({'user_id': new_user_id}).eq('user_id', OLD_USER_ID).execute()
    
    print(f"Migration complete! Updated {len(result.data)} jobs.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python migrate_jobs.py <NEW_USER_ID>")
        sys.exit(1)
        
    migrate(sys.argv[1])
