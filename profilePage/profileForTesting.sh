#!/bin/sh

# ----------------------------------------------------------------------------
# A script to generate a single Javascript file that is used by the profile page (profile.html)
# for development. It contains concatenated scripts in correct order.
#
# Author: Lukas Vlcek (lvlcek@redhat.com)
# ----------------------------------------------------------------------------

./../closure-library-99cd91/closure/bin/build/closurebuilder.py \
  \
  --root=./../closure-library-99cd91 \
  --root=./../core/src/main/javascript \
  --root=./src/main/javascript \
  --namespace="init.profile" \
  --output_mode='script' \
  --output_file=./src/main/webapp/profile-testing-only.js

if [ $? -ne 0 ]; then
  echo "# ---------------------------------------"
  echo "# Error:"
  echo "# execution of script terminated."
  echo "# ---------------------------------------"
  exit $?
fi

echo "# ---------------------------------------"
echo "# Success:"
echo "# src/main/webapp/profile-testing-only.js was generated"
echo "# to open the application in web browser (on Mac OSX) execute:"
echo "# open ./src/main/webapp/profile.html"
echo "# ---------------------------------------"