import io
import os
import urllib.request
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Resolve output path relative to web root
REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = REPO_ROOT / "public"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_FILE = OUTPUT_DIR / "get-it-on-shizustore.png"

# Canvas dimensions matching Kunzisoft get-it-on-github.png (646 x 250)
WIDTH, HEIGHT = 646, 250
img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Outer rounded rectangle (matches Kunzisoft rect: x=43, y=43, w=560, h=164, rx=20)
RX, RY, RW, RH = 43, 43, 560, 164
draw.rounded_rectangle(
    [RX, RY, RX + RW, RY + RH],
    radius=20,
    fill=(0, 0, 0, 255),
    outline=(166, 166, 166, 255),
    width=4
)

# Fetch official ShizuStore icon
ICON_URL = "https://raw.githubusercontent.com/timschneeb/ShizuStore/master/artwork/web/icon-512.png"
print(f"Fetching ShizuStore icon from {ICON_URL}...")
req = urllib.request.Request(ICON_URL, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    icon_data = resp.read()

icon = Image.open(io.BytesIO(icon_data)).convert("RGBA")
icon = icon.resize((120, 120), Image.Resampling.LANCZOS)
img.paste(icon, (68, 65), icon)

# Load font with cross-platform fallbacks
font_small = None
font_large = None
font_candidates_small = ["arial.ttf", "Arial.ttf", "DejaVuSans.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]
font_candidates_large = ["arialbd.ttf", "Arial-Bold.ttf", "DejaVuSans-Bold.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]

for font_name in font_candidates_small:
    try:
        font_small = ImageFont.truetype(font_name, 32)
        break
    except Exception:
        continue

for font_name in font_candidates_large:
    try:
        font_large = ImageFont.truetype(font_name, 66)
        break
    except Exception:
        continue

if font_small is None:
    font_small = ImageFont.load_default()
if font_large is None:
    font_large = ImageFont.load_default()

# Text positioning matching Kunzisoft layout
draw.text((215, 68), "GET IT ON", fill=(255, 255, 255, 255), font=font_small)
draw.text((215, 106), "ShizuStore", fill=(255, 255, 255, 255), font=font_large)

img.save(OUTPUT_FILE, "PNG")
print(f"Successfully generated PNG badge: {OUTPUT_FILE}")
