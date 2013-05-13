# App.js

`App.js` is used to setup context in `org.jboss.search.LookUp` and get DOM references.

This is crucial file for production code. This file along with `Init.js` should not be included in testing code as they
make references to production setup.

# LookUp.js

Trivial implementation of [service locator](http://en.wikipedia.org/wiki/Service_locator_pattern).
When used in tests some services can be injected with mock objects.

# Constants.js

Global application constants.