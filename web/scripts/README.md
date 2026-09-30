# Badge Scripts

I wrote these Python scripts to create the "Get it on ShizuStore" badges for the web catalog.

The badge was never AI generated. I made it purely with Python code to keep the dimensions, colors, and text crisp and clean.

## Scripts

* `gen_badge.py`: Creates the SVG vector badge.
* `gen_png.py`: Creates the transparent PNG badge.

Both scripts download the official ShizuStore icon, draw the badge border and text, and save the files to `web/public/`.

## Requirements

Install Pillow for the PNG script:

```bash
pip install pillow
```

## How to Run

Generate SVG:

```bash
python gen_badge.py
```

Generate PNG:

```bash
python gen_png.py
```

Output files:
* `web/public/get-it-on-shizustore.svg`
* `web/public/get-it-on-shizustore.png`
