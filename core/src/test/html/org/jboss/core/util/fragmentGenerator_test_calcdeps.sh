#!/bin/sh

../../../../../../../../closure-library-99cd91/closure/bin/calcdeps.py \
--dep ./../../../../../../../../closure-library-99cd91 \
--path ./../../../../../../main/javascript/org/jboss/core/Variables.js \
--path ./../../../../../../main/javascript/org/jboss/core/service/Locator.js \
--path ./../../../../../../main/javascript/org/jboss/core/service/LookUp.js \
--path ./../../../../../../main/javascript/org/jboss/core/service/LookUpImpl.js \
--path ./../../../../../../main/javascript/org/jboss/core/context/RequestParams.js \
--path ./../../../../../../main/javascript/org/jboss/core/util/dateTime.js \
--path ./../../../../../../main/javascript/org/jboss/core/util/fragmentParser.js \
--path ./../../../../../../main/javascript/org/jboss/core/util/fragmentGenerator.js \
--path ./../../../../../../test/javascript/org/jboss/core/util/fragmentGenerator_test.js \
--output_mode deps \
> fragmentGenerator_test_deps.js

echo "Generated file: fragmentGenerator_test_deps.js"