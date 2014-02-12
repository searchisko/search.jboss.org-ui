#!/bin/sh

../../../../../../../../../closure-library-99cd91/closure/bin/calcdeps.py \
--dep ./../../../../../../../../../closure-library-99cd91 \
--path ./../../../../../../../main/javascript/org/jboss/core/Constants.js \
--path ./../../../../../../../main/javascript/org/jboss/core/widget/list/ \
--output_mode deps \
> ListWidget_test_deps.js

echo "Generated file: ListWidget_test_deps.js"