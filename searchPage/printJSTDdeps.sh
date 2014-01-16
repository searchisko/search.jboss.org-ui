#!/bin/sh

# ----------------------------------------------------------------------------
# A simple script to generate dependency list for jsTestDriver in load order.
#
# Author: Lukas Vlcek (lvlcek@redhat.com)
# ----------------------------------------------------------------------------

./../closure-library-99cd91/closure/bin/build/closurebuilder.py \
  --root=./../closure-library-99cd91 \
  --root=./src/main/javascript \
  --root=./../core/src/main/javascript \
  --root=./src/test/jsTestDriver \
  \
  --output_mode='list' \
  --output_file=./rawlist \
  \
  --namespace="org.jboss.core.service.Locator" \
  --namespace="org.jboss.core.service.LookUp" \
  --namespace="org.jboss.core.service.LookUpImpl" \
  --namespace="org.jboss.core.util.ImageLoader" \
  --namespace="org.jboss.core.util.ImageLoaderNet" \
  --namespace="org.jboss.core.util.ImageLoaderNoop" \
  \
  --namespace="org.jboss.search.page.element.SearchFieldHandler" \
  --namespace="org.jboss.search.suggestions.query.model.Model" \
  --namespace="org.jboss.search.suggestions.query.model.Search" \
  --namespace="org.jboss.search.suggestions.query.model.Suggestion" \
  \
  \
  --namespace="test.org.jboss.search.SearchFieldHandlerAsyncTest" \
  --namespace="test.org.jboss.search.suggestions.query.model.ModelTest" \

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