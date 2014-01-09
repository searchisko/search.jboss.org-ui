#!/bin/sh

../../../../../../../closure-library-99cd91/closure/bin/calcdeps.py \
--dep ./../../../../../../../closure-library-99cd91 \
--path ./../../../../../../main/javascript_source/org/jboss/search \
--path ./../../../../../javascript/org/jboss/search/response \
--output_mode deps \
> normalize_test_deps.js

echo "Generated file: normalize_test_deps.js"