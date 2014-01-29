#!/bin/sh

../../../../../../../../closure-library-99cd91/closure/bin/calcdeps.py \
--dep ./../../../../../../../../closure-library-99cd91 \
--path ./../../../../../../main/javascript/org/jboss/core/Variables.js \
--path ./../../../../../../main/javascript/org/jboss/core/service \
--path ./../../../../../../main/javascript/org/jboss/core/util \
--output_mode deps \
> Locator_test_deps.js

echo "Generated file: Locator_test_deps.js"
