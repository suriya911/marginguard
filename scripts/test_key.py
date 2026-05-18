"""Test the Gemini API key with a minimal generation call."""
import os, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / "backend" / ".env")

import google.generativeai as genai
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

print("Testing gemini-2.0-flash...")
model = genai.GenerativeModel(
    "gemini-2.0-flash",
    generation_config=genai.GenerationConfig(
        temperature=0.2,
        response_mime_type="application/json",
    ),
)
try:
    r = model.generate_content('Return valid JSON: {"status": "ok"}')
    print("SUCCESS:", r.text[:100])
except Exception as e:
    print("FAILED:", type(e).__name__)
    print(str(e)[:500])
