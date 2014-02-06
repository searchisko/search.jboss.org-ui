#!/bin/sh

../../../../../../../../closure-library-99cd91/closure/bin/calcdeps.py \
--dep ./../../../../../../../../closure-library-99cd91 \
--path ./../../../../../../main/javascript/org/jboss/core/context/ \
--path ./../../../../../../main/javascript/org/jboss/core/util/urlGenerator.js \
--path ./../../../../../../test/javascript/org/jboss/core/util/urlGenerator_test.js \
--output_mode deps \
> urlGenerator_test_deps.js

echo "Generated file: urlGenerator_test_deps.js"