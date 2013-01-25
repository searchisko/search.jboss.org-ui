# Search Web UI

Web UI for (the new) [search.jboss.org](http://search.jboss.org/)

!!! WORK IN PROGRESS !!!

Built on top of [DCP API](https://github.com/jbossorg/dcp-api) (API Documentation and Mock server can be found here: <http://docs.jbossorg.apiary.io>).

## Setup for Development Stack

The implementation is based on the following technologies:

- Maven for builds, tests and IDE integration
- Closure compiler
- Closure library
- Closure templates (aka Soy templates)
- jQuery (mostly because it is required by third-party JS libraries)
- jsTestDriver

The following sections explain how the dev-stack is setup and how you can build the project for _production_ or during _development_ (having fast way how to test javascript code in browser or manually is always good without need to compile whole code).

Google Closure, Soy templates and jsTestDriver are all very interesting and powerful technologies. However, despite the fact that all three are developed by Google they are not really integrated. Setting up automated and smooth dev-stack on top of it (from the POW of Java developer - who is mostly used to Maven or Ant and IDEs like Eclipse or IDEA) is not very straightforward task.

### Building the application

- **Production:** When building production artifact, it is all automated and driven by Maven only (including automated javascript tests).
- **Local development:** When you need to quickly open the application without compilation then all you have to do is to execute one or two shell scripts and then you can open `index.html` in browser.

### Google Closure Version

It is important to keep all versions of [Google Closure](https://developers.google.com/closure) that are used during development in the sync.

By Closure compiler version we mean **release** number as defined for Maven use:
<http://code.google.com/p/closure-compiler/wiki/Maven#Releases>

#### Maven Plugin

[ClosureJavascriptFramework](https://github.com/jlgrock/ClosureJavascriptFramework) Maven plugin is used to compile javascript source code. Specific version of Closure compiler used by this Maven plugin is set in `pom.xml` in property `${closure.library.version}`.

#### Unit Testing via jsTestDriver

Tests are implemented using [jsTestDriver](http://code.google.com/p/js-test-driver/). These tests are pure JavaScript executed in (captured) browser so we need to make sure
browser can load needed parts of Closure library code. But Closure library is not released as a zip file, so the only option is to checkout source code directly from Closure library SVN using particular release (revision) number.

For example is we use revision **r2388**:

```
svn export -r r2388 http://closure-library.googlecode.com/svn/trunk/ closure-library-r2388
```

then it is important to make sure correct paths are used in `jsTestDriver.conf`:

```
load:
  - closure-library-r2388/closure/goog/base.js
  - ... etc
```

#### Keep jsTestDriver.conf Updated

To get updated list of required Closure library code for the `jsTestDriver.conf` just execute the `printClosureDependencies.sh`.

The script will print out list of JS scripts in correct order. Just copy and paste this list into `jsTestDriver.conf` into _load:_ section. If you are using other third-party js libraries
(like jQuery for instance) then make sure you add them manually.

#### Testing Manually in Browser

If you want to load the application into browser and test/play with it manually then use `buildForTesting.sh` or `buildForTestingWithLogging.sh` script.
When executed it builds `testing-only.js` which is referenced from `index.html`.

The only difference between `buildForTesting.sh` and `buildForTestingWithLogging.sh` is that the later makes use of Closure logging (by including
`src/main/javascript/LoggingWindow.js`).

### Closure Templates

To compile [Closure templates](https://developers.google.com/closure/templates/) (aka Soy Templates) into JavaScript run `compileClosureTemplates.sh`.

It grabs all templates from `/src/main/soy_templates` folder and compile them into
`src/main/javascript_source/generated_templates/` folder which makes them available
for Maven plugin (the Maven plugin requires all JS sources to be located under `javascript` folder).

Note the `soyutils_usegoog.js` script in `src/main/javascript_source/soyutils_slink`.
It is a symbolic to `closure-templates-2011-22-12/soyutils_usegoog.js`. This script is actually required by
compiled templates so we had to mirror it under `javascript_source` folder to make sure:

1. Maven plugin can find it during javascript compilation.
2. Configuration of `closurebuilder.py` `--root` argument in shell scripts is kept simple.

#### Updating Closure Templates

Important, before you start, verify if upgraded version of Closure library is also needed!

- Go <http://code.google.com/p/closure-templates/downloads/list> and see if new version has been released. We are interested in `closure-templates-for-javascript-*.zip` files.
- Extract to `src/closure-template-YYYY-MM-DD` folder.
- Update `src/main/javascript_source/soyutils_slink` to point to the new `closure-templates-YYYY-MM-DD/soyutils_usegoog.js` (see example below).
- Finally, update `compileClosureTemplates.sh`.

For example:
```
cd src/main/javascript_source
rm -rf soyutils_usegoog.js
ln -s ../../../closure-templates-2012-12-21/soyutils_usegoog.js soyutils_usegoog.js
```

### TODO - Automatic Building of Soy Templates 

Configure automatic execution of build scripts from within IntelliJ IDEA. Whenever you change content in `/src/main/soy_templates` folder compile them in the background. As a result compiled templates will be in sync with soy files and both will be stored in the code repository. 

HOWTO - <http://www.jetbrains.com/idea/webhelp/external-tools.html>

The other option might be (?) using [plovr](http://plovr.com) tool.