# Package org.jboss.search.service

## QueryService

The main interface all `QueryService` implementation must follow.

The main function of this service is to allow for object that has responsibility for execution of query requests (typically AJAX/XHR driven).

## QueryServiceXHR

Using XHR manager (from org.jboss.search.LookUp) to handle all XHR requests.

## QueryServiceCached

Experimental... TBD.

## QueryServiceTestImpl

TBD. Does not execute any real XHR requests. Can be used for tests.

## QueryServiceDispatcher

Live cycle of requests initiated by `QueryService` is reported via events through `QueryServiceDispatcher`.
See {@link org.jboss.search.service.QueryServiceEventType} for event types fired by this service.
`QueryServiceDispatcher` can (and should be) obtained from `org.jboss.search.LookUp#getQueryServiceDispatcher`.

### Example of usage:

```javascript
// ===================================
// Context initialization

// get query service dispatcher
var dispatcher = org.jboss.search.LookUp.getInstance().getQueryServiceDispatcher();

// set query service into LookUp (this time we are using TestImpl for testing environment)
org.jboss.search.LookUp.getInstance().setQueryService(
    new org.jboss.search.service.QueryServiceTestImpl(dispatcher);
);

// ===================================
// Your code

// subscribe for query service events
goog.events.listen(
    dispatcher,
    org.jboss.search.service.QueryServiceEventType.SEARCH_SUCCEEDED,
    function(e) {
        var event = /** @type {org.jboss.search.service.QueryServiceEvent} */ (e);
        var response = event.getMetadata();
        console.log("> " + response);
    }
);

// get QueryService implementation
/** @type {org.jboss.search.service.QueryService} */
var queryService = org.jboss.search.LookUp.getInstance().getQueryService();

queryService.userQuery("Hibernate transactions"); // user query is "Hibernate transactions"

// console output:
// > { user_query: "Hibernate transactions", hits: { ... }, ... }
```