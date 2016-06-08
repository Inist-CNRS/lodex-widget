# lodex-widget
Web widget to enrich your resources with LODEX resources

## Installation

Require the [lodex-widget.js]() script from your HTML page:

```html
<html>
<body>
    <script type="text/javascript" src="lodex-widget.js"></script>
</body>
</html>
```

## Usage

```javascript
// example usage
var LodexWidget = require('lodex-widget');
var lw = new LodexWidget('id','class');
lw.add(); // add the tooltips in the DOM
```
