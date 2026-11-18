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
mv -f noto-sans-bengali-v14-bengali-regular.ttf NotoSansBengali-Regular.ttf 2>/dev/null || true
mv -f noto-sans-bengali-v14-bengali-700.ttf NotoSansBengali-Bold.ttf 2>/dev/null || true
curl -sL -o /tmp/inter.zip "https://gwfh.mranftl.com/api/fonts/inter?download=zip&subsets=latin&variants=regular,600,800&formats=ttf" && unzip -o -q /tmp/inter.zip
mv -f inter-v20-latin-regular.ttf Inter-Regular.ttf 2>/dev/null || true
mv -f inter-v20-latin-600.ttf Inter-SemiBold.ttf 2>/dev/null || true
mv -f inter-v20-latin-800.ttf Inter-ExtraBold.ttf 2>/dev/null || true
ls -la
echo "FONTS DONE — V5Display-Bold.ttf / V5Display-ExtraBold.ttf are already in the repo (pushed separately)."
