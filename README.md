

![](docs/assets/sentret.gif) &nbsp; &nbsp; ![](docs/assets/title.png)
---

![](https://nodei.co/npm/sentret.png)

When doing client side analytics, you'll be tracking UI and programmatic events.<br>
Sentret helps you with the UI events.

### Declarative usage

```html
<div>
  <span>What would you like to buy?</span>

  <!-- We declare events as data attributes (configurable) -->
  <button data-event="SELECTED_BANANA">Banana (green)</button>
  <button data-event="SELECTED_BANANA" data-properties='{"ripe": true}'>
    Banana (ripe)
  </button>

  <button data-event="CHECKOUT" data-properties='{"from": "products-page"}'>
    Checkout
  </button>
</div>
```

### Real life usage with data binding

Things become even better when paired with a data binding framework.<br>
For example with Vue.js:
```html
<button
  :data-event="events.checkout"
  :data-event-props="{from: $router.currentRoute.name}"
>
  Checkout
</button>
```

### And the setup
```javascript
import {Sentret} from 'sentret'

// Our sample stack uses Segment (analytics.js) to ship events to the
// server, so we can plug it in directly as the handler
Sentret({log: true}).on('event', analytics.track)
```

### Supported Options

```javascript
{
  log: true,
  eventAttribute: 'event', // data-event
  propertiesAttribute: 'properties' // data-properties
}
```


