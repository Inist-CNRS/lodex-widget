/*eslint-env es6,browser*/
"use strict";
const sektor = require("sektor");
const aja = require("aja");
const JBJ = require("jbj");
JBJ.use(require("jbj-rdfa"));
JBJ.use(require("jbj-template"));
const html5tooltips = require("html5tooltipsjs");

function LodexWidget(itemsSelector, jbjStylesheet = {
  "get": 0,
  "$label": {
    "getJsonLdField": "http://www.w3.org/2008/05/skos-xl#prefLabel",
    "get": "content"
  },
  "$description": {
    "getJsonLdField": "http://www.w3.org/2004/02/skos/core#definition",
    "get": "content"
  },
  "mask": "label,description",
  "template": "<p>{{label}}</p>\n<p>{{description}}</p>"
}) {
  var _items = sektor(itemsSelector);
  if (!_items.length) {
    console.error(`Selector ${itemsSelector} does not match any DOM element!`);
    return;
  }

  for (let item of _items) {
    const { attributes: { about: { value: uri }} } = item;

    const selector = itemsSelector+'[about="'+ uri +'"]';
    const tooltipOptions = {
      targetSelector: selector,
      color: "bamboo",
      stickTo: "right"
    };

    aja()
    .url(uri + "?alt=jsonld")
    .on(200, function (response) {

      JBJ.render(jbjStylesheet,
      response,
      function (err, res) {
        if (err) { console.error(err); return; }
        tooltipOptions.contentText = res;
        html5tooltips(tooltipOptions);
      });

    })
    .go();

  }

}

module.exports = LodexWidget;
