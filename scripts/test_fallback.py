"""Quick smoke test for /api/pipeline/run with USE_FALLBACK=true."""
import os, sys, json
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
os.environ['USE_FALLBACK'] = 'true'

from dotenv import load_dotenv
load_dotenv('backend/.env')

from backend.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

r = client.post('/api/pipeline/run', json={'brand_constraint': 'Do not scale Retinol'})
brief = r.json()

print('status:', r.status_code)
print('budget_neutral:', brief['reallocation']['budget_neutral_verified'])
print('current_budget:', brief['reallocation']['total_current_daily_budget'])
print('recommended_budget:', brief['reallocation']['total_recommended_daily_budget'])
print('experiment_campaign:', brief['experiment']['product_name'])

cleanser_roas = next(ct['true_profit_roas'] for ct in brief['audit']['campaign_truths'] if ct['campaign_id'] == 'camp_cleanser')
print('cleanser true_profit_roas:', cleanser_roas)

print('moves:')
for move in brief['reallocation']['budget_moves']:
    print(f"  {move['product_name']}: delta=${move['delta_dollars']}")
