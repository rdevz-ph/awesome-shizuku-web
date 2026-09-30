import base64
import os
import urllib.request
from pathlib import Path

# Resolve output path relative to web root
REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = REPO_ROOT / "public"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_FILE = OUTPUT_DIR / "get-it-on-shizustore.svg"

# Fetch official ShizuStore icon
ICON_URL = "https://raw.githubusercontent.com/timschneeb/ShizuStore/master/artwork/web/icon-512.png"
print(f"Fetching ShizuStore icon from {ICON_URL}...")
req = urllib.request.Request(ICON_URL, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    icon_data = resp.read()

icon_b64 = base64.b64encode(icon_data).decode("utf-8")

# SVG matching Kunzisoft get-it-on-github.svg canvas and layout specifications (646 x 250)
svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="646" height="250" viewBox="0 0 646 250">
  <rect x="43" y="43" width="560" height="164" rx="20" ry="20" fill="#000000" stroke="#a6a6a6" stroke-width="4"/>
  <image x="68" y="65" width="120" height="120" href="data:image/png;base64,{icon_b64}"/>
  <text x="215" y="102" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="32" font-weight="500" letter-spacing="1">GET IT ON</text>
  <text x="215" y="174" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="64" font-weight="bold" letter-spacing="0.5">ShizuStore</text>
</svg>'''

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write(svg_content)

print(f"Successfully generated SVG badge: {OUTPUT_FILE}")
