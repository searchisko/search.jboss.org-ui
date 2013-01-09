#!/bin/sh

../../../../../../../closure-library-r2180/closure/bin/calcdeps.py \
--dep ./../../../../../../../closure-library-r2180 \
--path ./../../../../../../main/javascript_source/org/jboss/search \
--path ./../../../../../javascript/org/jboss/search/page \
--output_mode deps \
> SearchPageElements_test_deps.js

echo "Generated file: SearchPageElements_test_deps.js"