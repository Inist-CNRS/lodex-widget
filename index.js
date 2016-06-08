/*eslint-env es6,browser*/

const sektor = require('sektor');

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
    console.log(`id: ${_id}, class: ${_class}`);

    const selector = `#${_id} .${_class}`;
    console.log(selector);
    const items = sektor(selector);

  };
}

module.exports = LodexWidget;
