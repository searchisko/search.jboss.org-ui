# App.js

`App.js` is used to setup context into `org.jboss.search.service.LookUp` and get DOM references.

This is crucial file for production code. This file along with `InitSearch.js` should not be included in testing code as they
make references to production setup.

# Constants.js

Global application constants.

# Variables.js

Variables that need to be customized in order to produce JS application for different deployment environment.