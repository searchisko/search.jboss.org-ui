## QueryService

The main interface all `QueryService` implementations must follow.

## QueryServiceDispatcher

Live cycle of requests initiated by `QueryService` is reported via events through `QueryServiceDispatcher`.
See {@link org.jboss.core.service.query.QueryServiceEventType} for event types fired by this service.
`QueryServiceDispatcher` can be (and should be) obtained solely from
`org.jboss.core.service.Locator.getInstance().getLookup().getQueryServiceDispatcher()`.

The idea of having separate objects for query execution and query event dispatching is to allow easy testing of
logic that is dependent on query events.