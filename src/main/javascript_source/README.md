# generated_templates

Generated JS files from `../soy_templates`. Content of this folder is updated by running `../../compileClosureTemplates.sh` script.

# org

Package space for all [search web UI] application.

# Init.js

This javascript file is used to join `org.jboss.search.logging` code with the rest of the application code. The idea is that
for testing code we do not need logging code to be compiled and used. Thus we created very high-level piece of code to "glue"
logging into production code. To disable logging compilation we can simply comment out usage of logging in `Init.js`.

# soyutils_usegoog.js

Linked file from `closure-templates-X-X-X/soyutils_usegoog.js` to make functions and classes for Soy available in compiled code.

