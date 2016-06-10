/*eslint-env es6,browser*/

const sektor = require('sektor');
const aja = require('aja');
const JBJ = require('jbj');
JBJ.use(require('jbj-rdfa'));
const html5tooltips = require('html5tooltipsjs');

function LodexWidget(itemsSelector) {
  var _items = sektor(itemsSelector);
  if (!_items.length) {
    console.error(`Selector ${itemsSelector} does not match any DOM element!`);
    return;
  }

  this.add = function add() {

    for(let item of _items) {
      const { innerText: value,
            attributes: { about: { value: uri }} }
        = item;

      const properties = new Map([
        ["contentText", "http://www.w3.org/2008/05/skos-xl#prefLabel"],
        ["contentMore", "http://www.w3.org/2004/02/skos/core#definition"]
      ]);

      const selector = itemsSelector+'[about="'+ uri +'"]';
      console.log('selector', selector);
      const tooltipOptions = {
        targetSelector: selector,
        color: "bamboo",
        stickTo: "right"
      };

      aja()
      .url(uri + "?alt=jsonld")
      .on(200, function (response) {

        for (let [option, property] of properties) {
          JBJ.render({
            getJsonLdField: property
          }, response[0], function (err, res) {
            if (err) { console.error(err); return; }

            tooltipOptions[option] = res.content;
            properties.delete(option);
            console.log('properties.size',properties.size)
            if (properties.size) { return; }

            console.log('tooltipOptions', tooltipOptions)
            html5tooltips(tooltipOptions);
          });

        }

      })
      .go();

    }

  };
}

module.exports = LodexWidget;
