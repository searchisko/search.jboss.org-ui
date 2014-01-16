# Logging.js

**Experimental code**

This is to allow logging via `goog.debug.*` package and loggers.
When this code is compiled into the application (see [InitSearch.js](../../../../InitSearch.js)) then it registers on the
History navigation event and if logging URL fragment parameter is used then it enables logging.

Currently supported loggers:

 - console
 - fancyWindow