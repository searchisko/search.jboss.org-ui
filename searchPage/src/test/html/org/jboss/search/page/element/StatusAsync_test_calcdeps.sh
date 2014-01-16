#!/bin/sh

../../../../../../../../../closure-library-99cd91/closure/bin/calcdeps.py \
--dep ./../../../../../../../../../closure-library-99cd91 \
--path ./../../../../../../../main/javascript/org/jboss/search \
--path ./../../../../../../../../../core/src/main/javascript/org/jboss/core \
--output_mode deps \
> StatusAsync_test_deps.js

echo "Generated file: StatusAsync_test_deps.js"