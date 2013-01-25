#!/bin/sh

# ----------------------------------------------------------------------------
# A simple script to generate dependency list in load order.
#
# Author: Lukas Vlcek (lvlcek@redhat.com)
# ----------------------------------------------------------------------------

./closure-library-r2388/closure/bin/build/closurebuilder.py \
  --root=./closure-library-r2388 \
  --root=./src/main/javascript_source \
  --root=./src/test/jsTestDriver \
  \
  --output_mode='list' \
  --output_file=./rawlist \
  \
  --namespace="org.jboss.search.Constants" \
  --namespace="org.jboss.search.SearchFieldHandler" \
  \
  --namespace="org.jboss.search.suggestions.event.EventType" \
  --namespace="org.jboss.search.suggestions.event.SearchStart" \
  --namespace="org.jboss.search.suggestions.event.SearchFinish" \
  \
  --namespace="org.jboss.search.suggestions.query.model.Model" \
  --namespace="org.jboss.search.suggestions.query.model.Search" \
  --namespace="org.jboss.search.suggestions.query.model.Suggestion" \
  \
  --namespace="org.jboss.search.suggestions.query.view.View" \
  --namespace="org.jboss.search.suggestions.templates" \
  \
  --namespace="org.jboss.search.page.SearchPage" \
  --namespace="org.jboss.search.util.FragmentParser" \
  \
  \
  \
  --namespace="test.org.jboss.search.SearchFieldHandlerAsyncTest" \
  --namespace="test.org.jboss.search.util.FragmentParserTest" \
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