#!/bin/sh

../../../../../../../../closure-library-r2180/closure/bin/calcdeps.py \
--dep ./../../../../../../../../closure-library-r2180 \
--path ./../../../../../../../main/javascript_source/org/jboss/search/list/project \
--output_mode deps \
> Project_test_deps.js

echo "Generated file: Project_test_deps.js"