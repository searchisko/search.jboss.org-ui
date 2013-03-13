#!/bin/sh

../../../../../../../closure-library-r2388/closure/bin/calcdeps.py \
--dep ./../../../../../../../closure-library-r2388 \
--path ./../../../../../../main/javascript_source/org/jboss/search/ \
--path ./../../../../../javascript/org/jboss/search/util \
--output_mode deps \
> fragmentParser_test_deps.js

echo "Generated file: fragmentParser_test_deps.js"