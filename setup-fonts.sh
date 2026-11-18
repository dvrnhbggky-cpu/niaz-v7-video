#!/bin/bash
# Fetch the project's fonts into public/fonts with the exact filenames src/fonts.js expects.
set -e
mkdir -p public/fonts
cd public/fonts
# Noto Sans JP (from googlefonts/noto-cjk, renamed to the project's expected names)
curl -sL -o NotoSansJP-Regular.otf https://github.com/googlefonts/noto-cjk/raw/main/Sans/OTF/Japanese/NotoSansCJKjp-Regular.otf
curl -sL -o NotoSansJP-Bold.otf https://github.com/googlefonts/noto-cjk/raw/main/Sans/OTF/Japanese/NotoSansCJKjp-Bold.otf
curl -sL -o NotoSansJP-Black.otf https://github.com/googlefonts/noto-cjk/raw/main/Sans/OTF/Japanese/NotoSansCJKjp-Black.otf
# Noto Sans Bengali + Inter (static TTFs via google-webfonts-helper)
curl -sL -o /tmp/nsb.zip "https://gwfh.mranftl.com/api/fonts/noto-sans-bengali?download=zip&subsets=bengali&variants=regular,700&formats=ttf" && unzip -o -q /tmp/nsb.zip
for f in noto-sans-bengali-*-bengali-regular.ttf; do [ -f "$f" ] && mv -f "$f" NotoSansBengali-Regular.ttf; done
for f in noto-sans-bengali-*-bengali-700.ttf; do [ -f "$f" ] && mv -f "$f" NotoSansBengali-Bold.ttf; done
curl -sL -o /tmp/inter.zip "https://gwfh.mranftl.com/api/fonts/inter?download=zip&subsets=latin&variants=regular,600,800&formats=ttf" && unzip -o -q /tmp/inter.zip
for f in inter-*-latin-regular.ttf; do [ -f "$f" ] && mv -f "$f" Inter-Regular.ttf; done
for f in inter-*-latin-600.ttf; do [ -f "$f" ] && mv -f "$f" Inter-SemiBold.ttf; done
for f in inter-*-latin-800.ttf; do [ -f "$f" ] && mv -f "$f" Inter-ExtraBold.ttf; done
ls -la
echo "FONTS DONE — V5Display-Bold.ttf and V5Display-ExtraBold.ttf are custom brand fonts (not public) — add them from the toolchain ZIP public/fonts if the font check reports them MISSING."

# Presence check (the project's fonts.js needs exactly these filenames)
cd - >/dev/null
for font in NotoSansJP-Regular.otf NotoSansJP-Bold.otf NotoSansJP-Black.otf NotoSansBengali-Regular.ttf NotoSansBengali-Bold.ttf Inter-Regular.ttf Inter-SemiBold.ttf Inter-ExtraBold.ttf V5Display-Bold.ttf V5Display-ExtraBold.ttf; do
  if [ -s "public/fonts/$font" ]; then echo "OK: $font"; else echo "MISSING: $font"; fi
done
