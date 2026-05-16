"""
One-shot script to screenshot the Google Ads dashboard HTML at 1440x900.

Requires: pip install playwright
          playwright install chromium

Run from repo root:
    python scripts/capture_screenshot.py
"""

import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

HTML_PATH = Path(__file__).parent.parent / "assets" / "glownest_ads_dashboard.html"
OUT_PATH = Path(__file__).parent.parent / "backend" / "data" / "screenshots" / "glownest_ads_dashboard.png"


async def capture() -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1440, "height": 900})
        await page.goto(HTML_PATH.as_uri())
        await page.wait_for_timeout(300)
        OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
        await page.screenshot(path=str(OUT_PATH), full_page=False)
        await browser.close()
    print(f"Saved → {OUT_PATH}")


if __name__ == "__main__":
    asyncio.run(capture())
