'use strict';

let Request = require('request');

let ComponentUtils = (() => {

  let defaultHeader = () => {
    return {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
    };
  };

  let build = (method, url, form, doNext) => {
    if (form) {
      return Request({
        method   : method,
        gzip     : true,
        encoding : null,
        url      : url,
        headers  : defaultHeader(),
        form     : form
      }, (err, response, body) => {
        doNext(err, response, body);
      });
    }

    if (!form) {
      return Request({
        method   : method,
        gzip     : true,
        encoding : null,
        url      : url,
        headers  : defaultHeader(),
        form     : form
      }, (err, response, body) => {
        doNext(err, response, body);
      });
    }
  };

  return {
    build: build
  };

})();

module.exports = ComponentUtils;
