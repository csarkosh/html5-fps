#!/usr/bin/env bash

npm ci
npm run build

# inline main css chunk (prevents stalling main thread)
CSS_PATH=$(grep -Eoi '<link [^>]+>' build/index.html | grep -Eo 'href="[^\"]+"' | grep -Eo '(\/\S+).css')
CSS=$(head -n 1 "./build${CSS_PATH}")
CSS="<style type=\"text/css\">${CSS}</style>"
REPLACE_TAG="<link href=\"${CSS_PATH}\" rel=\"stylesheet\">"
sed -i -e "s%${REPLACE_TAG}%${CSS}%g" build/index.html

# gzip & sync to s3
find build -type f -exec gzip -r9 {} \; -exec mv {}.gz {} \;
aws s3 sync build s3://webgl.csarko.sh \
    --cache-control max-age=31536000,public \
    --content-encoding gzip \
    --delete \
    --exclude .github \
    --exclude index.html \
    --exclude asset-manifest.json
aws s3 sync build s3://webgl.csarko.sh \
    --cache-control no-store \
    --content-encoding gzip \
    --exclude "*" \
    --include index.html \
    --include asset-manifest.json
