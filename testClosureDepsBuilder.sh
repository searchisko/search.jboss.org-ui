#!/bin/sh

# ----------------------------------------------------------------------------
# A simple script to generate dependency list in load order.
#
# Author: Lukas Vlcek (lvlcek@redhat.com)
# ----------------------------------------------------------------------------

./closure-library-r2180/closure/bin/build/closurebuilder.py \
  --root=./closure-library-r2180 \
  --root=./src/main/javascript \
  --root=./src/test/webapp/js \
  --namespace="org.jboss.search.SearchFieldHandler" \
  --namespace="org.jboss.search.gui.test.SearchFieldHandlerTest" \
  --namespace="org.jboss.search.suggestions.templates" \
  --output_mode='list' \
  --output_file=./rawlist

# prepare the output for the jsTestDriver.conf format
# put the following output into the 'load:' section

echo "---- START ----"

while read line
do
  # leaving out all *Test.js files
  if ! [[ "${line}" =~ "Test.js" ]]; then
    echo " - $line"
  fi
done < ./rawlist

echo "---- END ----"

rm ./rawlist