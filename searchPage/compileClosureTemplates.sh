#!/bin/sh

# ----------------------------------------------------------------------------
# A script to compile Closure Templates into JavaScript.
#
# Author: Lukas Vlcek (lvlcek@redhat.com)
# ----------------------------------------------------------------------------

find ./src/main/soy_templates -name '*.soy' -print | xargs java -jar ./../closure-templates-2012-12-21/SoyToJsSrcCompiler.jar \
  --outputPathFormat ./src/main/javascript/generated_templates/{INPUT_FILE_NAME_NO_EXT}.soy.js \
  --shouldProvideRequireSoyNamespaces \
  --shouldGenerateJsdoc
