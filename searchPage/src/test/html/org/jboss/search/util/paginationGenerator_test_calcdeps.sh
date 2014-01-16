#!/bin/sh

../../../../../../../../closure-library-99cd91/closure/bin/calcdeps.py \
--dep ./../../../../../../../../closure-library-99cd91 \
--path ./../../../../../../main/javascript/org/jboss/search/ \
--path ./../../../../../../../../core/src/main/javascript/org/jboss/core \
--path ./../../../../../javascript/org/jboss/search/util \
--output_mode deps \
> paginationGenerator_test_deps.js

echo "Generated file: paginationGenerator_test_deps.js"