/*eslint-env es6,browser*/

const sektor = require('sektor');
const aja = require('aja');
const JBJ = require('jbj');
JBJ.use(require('jbj-rdfa'));
const html5tooltips = require('html5tooltipsjs');

function LodexWidget(id = null, classe = null) {
  var _id = id;
  var _class = classe;

  this.id = function id(id) {
    _id = id;
    return this;
  };

  this.classe = function classe(classe) {
    _class = classe;
    return this;
  };

  this.add = function add() {

    const selector = `#${_id} .${_class}`;
    const items = sektor(selector);
    if (!items.length) { console.log('Nothing found'); return; }
    for(let item of items) {
      const { innerText: value,
            attributes: { about: { value: uri }} }
        = item;

      aja()
      .url(uri + "?alt=jsonld")
      .on(200, function (response) {
        JBJ.render({
          getJsonLdField: "http://www.w3.org/2008/05/skos-xl#prefLabel"
        }, response[0], function (err, res) {
          const selector = '#article-types .facet[about="'+ uri +'"]';
          console.log('selector', selector);
          html5tooltips({
            targetSelector: selector,
            contentText: res.content
          });
        });
      })
      .go();

    }

  };
}

module.exports = LodexWidget;
