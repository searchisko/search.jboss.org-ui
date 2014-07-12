#!/bin/sh

../../../../../../../../../closure-library-99cd91/closure/bin/calcdeps.py \
--dep ./../../../../../../../../../closure-library-99cd91 \
--path ./../../../../../../../main/javascript/org/jboss/core/service/query/SimpleTimeCache.js \
--output_mode deps \
> SimpleTimeCache_test_deps.js

echo "Generated file: SimpleTimeCache_test_deps.js"
