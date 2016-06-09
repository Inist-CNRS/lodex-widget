# lodex-widget
Web widget to enrich your resources with LODEX resources

## Installation

Require the [lodex-widget.js](https://rawgit.com/Inist-CNRS/lodex-widget/master/lodex-widget.js) script from your HTML page:

```html
<html>
<head>
    <script type="text/javascript" src="lodex-widget.js"></script>
</head>
<body>
</body>
</html>
```

## Usage

```html
<div id="article-types">
    <div class="facet" about="http://article-type.lod.istex.fr/=/research-article" property="dc:identifier">
        research-article
    </div>
    <div class="facet" about="http://article-type.lod.istex.fr/=/review-article" property="dc:identifier">
        review-article
    </div>
    <div class="facet" about="http://article-type.lod.istex.fr/=/article" property="dc:identifier">
        article
    </div>
    <div class="facet" about="http://article-type.lod.istex.fr/=/case-report" property="dc:identifier">
        case-report
    </div>
</div>
```

```javascript
// example usage
var LodexWidget = require('lodex-widget');
var lw = new LodexWidget('article-types','facet');
lw.add(); // add the tooltips in the DOM
```
