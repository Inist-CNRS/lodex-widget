/*eslint-env es6,browser*/
/*global HTML5TooltipUIComponent*/
"use strict";
const sektor = require("sektor");
const aja = require("aja");
const JBJ = require("jbj");
JBJ.use(require("jbj-rdfa"));
JBJ.use(require("jbj-template"));
require("html5tooltipsjs");

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
  // Associate URI and EventTarget
  var _items = sektor(itemsSelector);
  if (!_items.length) {
    console.error(`Selector ${itemsSelector} does not match any DOM element!`);
    return;
  }

  var _eventTargets = {};
  /**
   * Get the DOM Element matching the itemsSelector and
   * having an about attribute matching the uri of the item
   *
   * @param  {DOM Element} item The item for which we want the target
   * @return {DOM Element}      The target element
   */
  const getTarget = function (item) {
    const { attributes: { about: { value: uri }} } = item;
    if (!_eventTargets[uri]) {
      const selector = itemsSelector+'[about="'+ uri +'"]';
      const target = sektor(selector)[0];
      _eventTargets[uri] = target;
    }
    return _eventTargets[uri];
  };

  const _tooltips = {};
  /**
   * Get the tooltip associated to the item (having an about attribute)
   *
   * @param  {DOM Element} item The item for which we want the tooltip
   * @return {Tooltip}          The matching tooltip
   */
  const getTooltip = function(item) {
    const { attributes: { about: { value: uri }} } = item;
    return _tooltips[uri];
  };

  const show = function(e) {
    for (let uri in _tooltips) {
      _tooltips[uri].hide();
    }
    const tooltip = getTooltip(e.target);
    tooltip.show();
  };
  const hide = function(e) {
    const tooltip = getTooltip(e.target);
    tooltip.hide();
  };
  window.closeTooltip = function closeTooltip(uri) {
    const tooltip = _tooltips[uri];
    tooltip.hide();
  };

  let _persistent = false;

  this.add = function add({persistent = false} = {}) {
    _persistent = persistent;
    for (let item of _items) {
      const { attributes: { about: { value: uri }} } = item;
      const target = getTarget(item);
      const tooltipOptions = {
        target: target,
        color: "cloud",
        stickTo: "right"
      };

      aja()
      .url(uri + "?alt=jsonld")
      .on(200, function (response) {

        JBJ.render(jbjStylesheet,
        response,
        function (err, res) {
          if (err) { console.error(err); return; }

          res = `
          <button onclick="closeTooltip('${uri}');" style="float:right">x</button>
          <p><a href="${uri}">Source</a></p>
          ${res}`;
          tooltipOptions.contentText = res;
          var tooltip = new HTML5TooltipUIComponent;
          tooltip.set(tooltipOptions);
          _tooltips[uri] = tooltip;
          document.body.appendChild(tooltip.elements[0]);

          target.addEventListener("mouseenter", show);
          if (!persistent) {
            target.addEventListener("mouseleave", hide);
          }
        });

      })
      .go();

    }

    return this;
  };

  // this.persist = function persist(persistent = false) {
  //   for (let item of _items) {
  //     if (persistent) {
  //       item.addEventListener("mouseenter", show);
  //       item.removeEventListener("mouseleave", hide);
  //     }
  //     else {
  //       item.addEventListener("mouseenter", show);
  //       item.addEventListener("mouseleave", hide);
  //     }
  //   }
  //   return this;
  // };

  this.activate = function activate() {
    for (let item of _items) {
      item.addEventListener("mouseenter", show);
      if (!_persistent) {
        item.addEventListener("mouseleave", hide);
      }
    }
    return this;
  };

  this.desactivate = function desactivate() {
    for (let item of _items) {
      item.removeEventListener("mouseenter", show);
      item.removeEventListener("mouseleave", hide);
    }
    return this;
  };

}

module.exports = LodexWidget;
