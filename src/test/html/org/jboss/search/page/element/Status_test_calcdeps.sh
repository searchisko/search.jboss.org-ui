#!/bin/sh

../../../../../../../../closure-library-99cd91/closure/bin/calcdeps.py \
--dep ./../../../../../../../../closure-library-99cd91 \
--path ./../../../../../../../main/javascript_source/org/jboss/search \
--output_mode deps \
> Status_test_deps.js

echo "Generated file: Status_test_deps.js"