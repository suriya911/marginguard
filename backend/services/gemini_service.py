import json
import os
from pathlib import Path

from google import genai
from google.genai import types
from dotenv import load_dotenv
from PIL import Image
import io

load_dotenv()

_MODEL_NAME = "gemini-2.0-flash"


def _client() -> genai.Client:
    return genai.Client(api_key=os.environ["GEMINI_API_KEY"])


def _config(system_instruction: str) -> types.GenerateContentConfig:
    return types.GenerateContentConfig(
        system_instruction=system_instruction,
        temperature=0.2,
        response_mime_type="application/json",
    )


def call_multimodal(system_instruction: str, image_path: Path, text_prompt: str) -> dict:
    """Call Gemini with one image + text. Returns parsed JSON dict. Retries once on parse failure."""
    client = _client()
    image = Image.open(image_path)

    # Convert PIL image to bytes for the new SDK
    buf = io.BytesIO()
    image.save(buf, format="PNG")
    image_bytes = buf.getvalue()
    image_part = types.Part.from_bytes(data=image_bytes, mime_type="image/png")

    for attempt in range(2):
        response = client.models.generate_content(
            model=_MODEL_NAME,
            contents=[image_part, text_prompt],
            config=_config(system_instruction),
        )
        try:
            return json.loads(response.text)
        except json.JSONDecodeError:
            if attempt == 1:
                raise RuntimeError(
                    f"Gemini returned invalid JSON after 2 attempts.\n\nRaw:\n{response.text}"
                )


def call_text(system_instruction: str, text_prompt: str) -> dict:
    """Call Gemini with text only. Returns parsed JSON dict. Retries once on parse failure."""
    client = _client()

    for attempt in range(2):
        response = client.models.generate_content(
            model=_MODEL_NAME,
            contents=text_prompt,
            config=_config(system_instruction),
        )
        try:
            return json.loads(response.text)
        except json.JSONDecodeError:
            if attempt == 1:
                raise RuntimeError(
                    f"Gemini returned invalid JSON after 2 attempts.\n\nRaw:\n{response.text}"
                )
