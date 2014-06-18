# List Widget

**List widget** is a general component that allows to dynamically build lists of items that can be pulled from (general)
data sources and list items related to a particular data source can be updated asynchronously at any time.
On top of that this component enables selection of individual items either by pointer device or keyboard.

The idea comes from need to build a general component that would allow implementation of complex suggestion drop-down
UI components similar to [Spotlight][].

[Spotlight]: http://en.wikipedia.org/wiki/Spotlight_(software)

## Design

The design has been inspired by [MVC pattern] and it enables the developer to focus on the "C" (standing for the "controller")
part and do not bother much about the rest of the code.

[MVC pattern]: http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller

TODO: insert image that would describe the design.

## Important classes


### ListController

This is the main controller of the List Widget component. It is an interface that developers are expected to implement
for particular use cases. Instances of `ListController` are not instantiated directly by the developer but via
`ListWidgetFactory.build()` method.

To see example go to [EchoListControllerTest.js](EchoListControllerTest.js) which is a simple implementation used
for manual testing (to see it in action open `core/src/test/html/org/jboss/core/widget/list/InteractiveListWidget_test.html`
in web browser.)

### ListWidgetFactory

[ListWidgetFactory](ListWidgetFactory.js) is a [Factory][] that knows how to instantiate [ListController](ListController.js)
instances according to provided configuration and ties is to model and view parts. Once developer implements
`ListController` class then the ListWidgetFactory is used to get the instance of it. See the following example:

```javascript
var hostingDom = goog.dom.createDom('div');
    
var controller = org.jboss.core.widget.list.ListWidgetFactory.build({
    lists: [
        { key: 'LIST_1', caption: null },
        { key: 'LIST_2', caption: 'List caption' }
    ],
    controllerConstructor: fully.qualified.mane.of.ListController,
    additionalConstructorParams: [ ],
    attach: hostingDom
});

controller.input('I am the user input...');
```

##### `controllerConstructor` and `additionalConstructorParams`

This will return instance of `fully.qualified.mane.of.ListController` class which is passed both the `ListModelContainer`
and `ListViewContainer` instances into constructor. If the controller constructor can accept more parameters then
they can be passed via `additionalConstructorParams` field of the configuration object.

##### `lists`

The `lists` configuration option describes lists that both the model and view will reflect. Each list requires unique
`key` and optional `caption`. If the `caption` is provided then it will be rendered for each relevant non-empty model.

##### `attach`

The `attach` configuration option contains reference to the DOM element which the controller will render the view to.

User input can be passed into `controller.input()` method (which expects `string` parameter). Typically, the controller
gets the user input and passes it to all the `DataSource`s and stream the incoming data to relevant `ListModel`s
(via `ListModelContainer`) which triggers update of the view layer. 

[Factory]: http://en.wikipedia.org/wiki/Factory_(object-oriented_programming)

### DataSource

[DataSource](datasource/DataSource.js) is an interface for classes that can provide data in form of
`Array.<org.jboss.core.widget.list.ListItem>`. It can accept user input (i.e. query string) and emit event with new
data, thus it is designed to work with asynchronous data sources (like REST API). If the input does not yield
any data (i.e. the response should be empty) then it simply emits an empty array.

See example:

```javascript
/**
 * Very simple "echo-like" data source.
 */
MyDataSource.prototype.get = function(query) {
  var data = [];
  if (!goog.string.isEmptySafe(query)) {
    data.push(new org.jboss.core.widget.list.ListItem('property', query));
  }
  this.dispatchEvent(
      new org.jboss.core.widget.list.datasource.DataSourceEvent(data)
  );
};
```

## Selecting List Items

User can interact with the List Widget view layer via pointing device (mouse) or keyboard (or both). User has the option to
select or unselect individual list items. This can be accomplished via two objects `KeyboardListener` and `MouseListener`
that both can be **set** and **unset** on the controller at runtime (after controller is instantiated).

### KeyboardListener

[KeyboardListener](keyboard/KeyboardListener.js) is a base class that specific implementation need to extend. It is
responsible for catching keyboard navigation events (like `keyup`, `keydown`, `enter`, ...) for provided `input` element
and fires appropriate events that controller can listen and react to. Controller can be set KeyboardListener instance
at runtime.

```javascript
/** @type {org.jboss.core.widget.list.keyboard.KeyboardListener} */
var keyboardListener_ = new org.jboss.core.widget.list.keyboard.InputFieldKeyboardListener(inputField);
controller.setKeyboardListener(keyboardListener_);
```

### MouseListener

[MouseListener](mouse/MouseListener.js) is ...TBD. Controller can be set MouseListener instance at runtime.

```javascript
/** @type {org.jboss.core.widget.list.mouse.MouseListener} */
var mouseListener_ = new org.jboss.core.widget.list.mouse.MouseListener(hostingDom);
controller.setMouseListener(mouseListener_);
```

## Examples

### Simple Echo Box

First example is very simple. It is a drop-down list that echos user input. To make it a little bit more interesting
the resulting list consists of two item lists each containing just a single item (user input). The first item list
will echo user input as soon as it is changed, the second will have a small async delay (simulating wait for response
from remote data source).

```javascript
// JavaScript example here.
```

### Search Suggestions

Second example is more complex. It demonstrates how to use the List Widget to construct list that is fed from two
REST services. And because we expect that response from the second REST service will be significantly slower we will
use a third REST service to get temporary list items from that will be displayed to the user until response from the
second REST service is delivered.

```javascript
// JavaScript example here.
```

