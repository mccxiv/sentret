

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

### Methods
Documentation is in TypeScript for clarity. Typescript is not required
```typescript
interface SentretInstance {
  // Listen for UI events
  on: (eventType: 'event', cb: SentretClickCallback) => void

  // Sometimes components from poorly written external libraries don't
  // propagate clicks. In such cases you may forward them to Sentret using
  // this method
  click: (event: MouseEvent) => void

  // If your workflow requires it, you may destroy this Sentret instance
  // which will clean up any event listeners on the DOM
  destroy: () => void
}

// The UI event callback should accept an event name and a data object
type SentretClickCallback = (eventName: string, data?: object) => any
```


