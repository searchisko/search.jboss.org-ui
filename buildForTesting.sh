#!/bin/sh

# ----------------------------------------------------------------------------
# A script to generate a single Javascript file that is used for local
# development. It contains concatenated scripts in correct order.
#
# Author: Lukas Vlcek (lvlcek@redhat.com)
# ----------------------------------------------------------------------------

./closure-library-99cd91/closure/bin/build/closurebuilder.py \
  \
  --root=./closure-library-99cd91 \
  --root=./src/main/javascript_source \
  --namespace="init" \
  --output_mode='script' \
  --output_file=./src/main/webapp/testing-only.js

echo "# ---------------------------------------"
echo "# src/main/webapp/testing-only.js was updated"
echo "# to open the application in web browser (on Mac OSX) execute:"
echo "# open ./src/main/webapp/index.html"
echo "# ---------------------------------------"