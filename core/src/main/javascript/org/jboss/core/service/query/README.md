## QueryService

The main interface all `QueryService` implementation must follow.

The main function of this service is to allow for object that has responsibility for execution of query requests (typically AJAX/XHR driven).

## QueryServiceDispatcher

Live cycle of requests initiated by `QueryService` is reported via events through `QueryServiceDispatcher`.
See {@link org.jboss.core.service.query.QueryServiceEventType} for event types fired by this service.
`QueryServiceDispatcher` can (and should be) obtained from `org.jboss.core.service.Locator.getInstance().getLookup().getQueryServiceDispatcher()`.