import base64
import json
import os
from pathlib import Path

import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image

load_dotenv()

_MODEL_NAME = "gemini-2.0-flash"
_GENERATION_CONFIG = genai.GenerationConfig(
    temperature=0.2,
    response_mime_type="application/json",
)


def _make_model(system_instruction: str) -> genai.GenerativeModel:
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    return genai.GenerativeModel(
        model_name=_MODEL_NAME,
        system_instruction=system_instruction,
        generation_config=_GENERATION_CONFIG,
    )


def call_multimodal(system_instruction: str, image_path: Path, text_prompt: str) -> dict:
    """Call Gemini with one image + text. Returns parsed JSON dict. Retries once on parse failure."""
    model = _make_model(system_instruction)
    image = Image.open(image_path)

    for attempt in range(2):
        response = model.generate_content([image, text_prompt])
        try:
            return json.loads(response.text)
        except json.JSONDecodeError:
            if attempt == 1:
                raise RuntimeError(
                    f"Gemini returned invalid JSON after 2 attempts.\n\nRaw:\n{response.text}"
                )


def call_text(system_instruction: str, text_prompt: str) -> dict:
    """Call Gemini with text only. Returns parsed JSON dict. Retries once on parse failure."""
    model = _make_model(system_instruction)

    for attempt in range(2):
        response = model.generate_content(text_prompt)
        try:
            return json.loads(response.text)
        except json.JSONDecodeError:
            if attempt == 1:
                raise RuntimeError(
                    f"Gemini returned invalid JSON after 2 attempts.\n\nRaw:\n{response.text}"
                )
