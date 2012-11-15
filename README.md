# Search Web UI

Web UI for the (the new) [search.jboss.org](http://search.jboss.org/)

!!! WORK IN PROGRESS !!!

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

- **Production:** When building production artefact, it is all automated and driven by Maven only (including automated javascript tests).
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

For example is we use revision **r2180**:

```
svn export -r r2180 http://closure-library.googlecode.com/svn/trunk/ closure-library-r2180
```

then it is important to make sure correct paths are used in `jsTestDriver.conf`:

```
load:
  - src/test/closure-library-r2180/closure/goog/base.js
  - ... etc
```

#### Keep jsTestDriver.conf Updated

To get updated list of required Closure library code for the `jsTestDriver.conf` just execute the `testClosureDepsBuilder.sh`.

The script will print out list of JS scripts in correct order. Just copy and paste this list into `jsTestDriver.conf` into _load:_ section. If you are using other third-party js libraries
(like jQuery for instance) then make sure you add them manually.

#### Testing Manually in Browser

If you want to load the application into browser and test/play with it manually then you will find `devClosureDepsBuilder.sh` script useful. When executed it builds `testing-only.js` which is referenced from `index.html`. 

### Soy Templates

To build [Soy templates](https://developers.google.com/closure/templates/) run `devClosureTemplatesBuilder.sh`.

It grabs all soy templates from `/src/main/soy_templates` folder and compile them into `src/main/javascript/generated_templates/` folder which makes them available for Maven plugin (the Maven plugin requires all JS sources to be located under `javascript` folder).

Note the `soyutils_usegoog.js` script in `src/main/javascript/soyutils_slink`. It is a symbolic to `closure-templates-2011-22-12/soyutils_usegoog.js`. This script is actually required by compiled Soy templates so we had to mirror it under `javascript` folder to make sure:

1. Maven plugin can find it during javascript compilation.
2. Configuration of `closurebuilder.py` `--root` argument in shell scripts is kept simple.

### TODO - Automatic Building of Soy Templates 

Configure automatic execution of build scripts from within IntelliJ IDEA. Whenever you change content in `/src/main/soy_templates` folder compile them in the background. As a result compiled templates will be in sync with soy files and both will be stored in the code repository. 

HOWTO - <http://www.jetbrains.com/idea/webhelp/external-tools.html>