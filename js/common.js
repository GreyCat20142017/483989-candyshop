'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var getStringCompareResult = function (left, right) {
    if (left > right) {
      return 1;
    } else if (left < right) {
      return -1;
    } else {
      return 0;
    }
  };

  window.common = {
    getLimitedValue: function (newValue, leftLimit, rightLimit) {
      if (newValue < leftLimit) {
        return leftLimit;
      }
      if (newValue > rightLimit) {
        return rightLimit;
      }
      return newValue;
    },

    getValueByScale: function (min, max, level) {
      return Math.round(100 * (min + level * (max - min) / 100)) / 100;
    },

    getTextForm: function (sourceNumber, textForms) {
      sourceNumber = Math.abs(sourceNumber) % 100;
      var temporaryNumber = sourceNumber % 10;
      if (sourceNumber > 10 && sourceNumber < 20) {
        return textForms[2];
      }
      if (temporaryNumber > 1 && temporaryNumber < 5) {
        return textForms[1];
      }
      if (temporaryNumber === 1) {
        return textForms[0];
      }
      return textForms[2];
    },

    debounce: function (action) {
      var lastTimeout = null;
      return function () {
        var parameters = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          action.apply(null, parameters);
        }, DEBOUNCE_INTERVAL);
      };
    },

    getIndexByID: function (arr, key) {
      return arr.indexOf(arr.filter(function (item) {
        return item.id === key;
      })[0]);
    },

    getKeysArrayFromObject: function (obj) {
      return Object.keys(obj).map(function (key) {
        return key;
      });
    },

    getArrayFromObject: function (obj) {
      return Object.keys(obj).map(function (key) {
        return obj[key];
      });
    },

    getArrayFromCollection: function (collection) {
      return Array.prototype.slice.call(collection);
    },

    getLuhnResult: function (text) {
      text = '' + text;
      var result = text.replace(' ', '').split('').map(function (item, i) {
        return ((i + 1) % 2 === 0) ? parseInt(item, 10) : parseInt(item, 10) * 2;
      }).reduce(function (sum, current) {
        return sum + ((current >= 10) ? (current - 9) : current);
      }, 0);
      return ((result % 10) === 0);
    },

    getStringCompareResult: getStringCompareResult

  };
})();
