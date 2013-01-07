#!/bin/sh

# ----------------------------------------------------------------------------
# A script to compile Soy Templates into JavaScript.
#
# Author: Lukas Vlcek (lvlcek@redhat.com)
# ----------------------------------------------------------------------------

find ./src/main/soy_templates -name '*.soy' -print | xargs java -jar ./closure-templates-2011-22-12/SoyToJsSrcCompiler.jar \
  --outputPathFormat src/main/javascript_source/generated_templates/{INPUT_FILE_NAME_NO_EXT}.soy.js \
  --shouldProvideRequireSoyNamespaces \
  --shouldGenerateJsdoc
