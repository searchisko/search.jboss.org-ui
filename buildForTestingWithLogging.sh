#!/bin/sh

# ----------------------------------------------------------------------------
# A script to generate a single Javascript file that is used for local
# development. It contains concatenated scripts in correct order.
#
# Author: Lukas Vlcek (lvlcek@redhat.com)
# ----------------------------------------------------------------------------

./closure-library-r2180/closure/bin/build/closurebuilder.py \
  \
  --root=./closure-library-r2180 \
  --root=./src/main/javascript \
  \
  \
  \
  --namespace="LoggingWindow" \
  \
  --namespace="Init" \
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
  --output_mode='script' \
  --output_file=./src/main/webapp/testing-only.js

echo "---------------------------------------"
echo "src/main/webapp/testing-only.js updated"