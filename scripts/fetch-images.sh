#!/usr/bin/env bash
# Downloads the Miveloo reference photos into public/images/photos using the manifest.
# Run on a machine with internet:  bash scripts/fetch-images.sh
# LICENCE: search availability is not permission. Confirm rights/attribution with each publisher before production use.
set -u
cd "$(dirname "$0")/.."
mkdir -p public/images/photos
python3 - <<'PY'
import csv, pathlib, urllib.request
out = pathlib.Path("public/images/photos")
ok = 0
with open("scripts/image-manifest.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        t = out / row["filename"]
        if t.exists() and t.stat().st_size > 5000:
            ok += 1; continue
        try:
            req = urllib.request.Request(row["source_url"], headers={"User-Agent": "Mozilla/5.0 (Miveloo asset fetch)"})
            with urllib.request.urlopen(req, timeout=30) as r, open(t, "wb") as w:
                w.write(r.read())
            print("ok  ", row["filename"]); ok += 1
        except Exception as e:
            print("FAIL", row["filename"], "->", e)
print(f"{ok} photo(s) available")
try:  # keep the repo light: shrink anything wider than 1600px (optional, needs Pillow)
    from PIL import Image
    for t in out.glob("*"):
        if t.suffix.lower() in (".jpg", ".jpeg", ".png"):
            im = Image.open(t)
            if im.width > 1600:
                im = im.resize((1600, int(im.height * 1600 / im.width)))
                im.save(t, quality=82, optimize=True) if t.suffix.lower() != ".png" else im.save(t, optimize=True)
except Exception as e:
    print("(resize skipped:", e, ")")
PY
node scripts/photos-manifest.mjs
