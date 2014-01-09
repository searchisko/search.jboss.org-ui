#!/bin/sh

../../../../../../../closure-library-99cd91/closure/bin/calcdeps.py \
--dep ./../../../../../../../closure-library-99cd91 \
--path ./../../../../../../main/javascript_source/org/jboss/search \
--path ./../../../../../javascript/org/jboss/search/page \
--output_mode deps \
> SearchPageElements_test_deps.js

echo "Generated file: SearchPageElements_test_deps.js"