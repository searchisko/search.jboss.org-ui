#!/bin/sh

../../../../../../../../closure-library-99cd91/closure/bin/calcdeps.py \
--dep ./../../../../../../../../closure-library-99cd91 \
--path ./../../../../../../main/javascript/org/jboss/search \
--path ./../../../../../../main/javascript/generated_templates \
--path ./../../../../../../../../core/src/main/javascript/org/jboss/core \
--output_mode deps \
> UserIdle_test_deps.js

echo "Generated file: UserIdle_test_deps.js"