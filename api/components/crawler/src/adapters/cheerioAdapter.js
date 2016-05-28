'use strict';

let Cheerio        = require('cheerio');

let ComponentUtils = (() => {
  let Util = {};

  Util.getValueByMock = function($, element, mockValue) {
    return $(element).eq(mockValue).text();
  }

  Util.loadCheerio = function (body) {
    return Cheerio.load(body, {
      normalizeWhitespace: true,
      xmlMode: false
    });
  }

  return Util;
})();

module.exports = ComponentUtils;