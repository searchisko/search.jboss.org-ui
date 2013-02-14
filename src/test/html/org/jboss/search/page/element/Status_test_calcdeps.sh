#!/bin/sh

../../../../../../../../closure-library-r2388/closure/bin/calcdeps.py \
--dep ./../../../../../../../../closure-library-r2388 \
--path ./../../../../../../../main/javascript_source/org/jboss/search \
--output_mode deps \
> Status_test_deps.js

echo "Generated file: Status_test_deps.js"