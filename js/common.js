'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var getRandomFromRange = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  var shuffleArray = function (sourceArray) {
    var array = sourceArray.slice();
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temporaryValue = array[i];
      array[i] = array[j];
      array[j] = temporaryValue;
    }
    return array;
  };

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
    getUniqueFromArray: function (sourceArray) {
      var temporaryObject = {};
      sourceArray.forEach(function (item) {
        temporaryObject[item.toString()] = true;
      });
      return Object.keys(temporaryObject).map(function (key) {
        return key;
      });
    },

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

    getRandomAvatar: function () {
      return 'img/avatar-' + getRandomFromRange(1, 6) + '.svg';
    },

    getRandomLimitedSetFromArray: function (sourceArray, setLength) {
      var reSortedArray = shuffleArray(sourceArray);
      reSortedArray.length = Math.min(setLength, reSortedArray.length);
      return reSortedArray;
    },

    getCardsByRating: function (sourceArray) {
      var reSortedArray = sourceArray.slice().sort(function (firstItem, secondItem) {
        var rank = (firstItem.rating && secondItem.rating) ? (secondItem.rating.value - firstItem.rating.value) : 0;
        if (rank === 0) {
          rank = (firstItem.rating && secondItem.rating) ? (secondItem.rating.number - firstItem.rating.number) : 0;
        }
        if (rank === 0) {
          rank = (firstItem.name && secondItem.name) ? getStringCompareResult(firstItem.name, secondItem.name) : 0;
        }
        return rank;
      });
      return reSortedArray;
    },


    getCardsByPrice: function (sourceArray, ascending) {
      var reSortedArray = sourceArray.slice().sort(function (firstItem, secondItem) {
        var direction = ascending ? (-1) : 1;
        var rank = (firstItem.price && secondItem.price) ? direction * (secondItem.price - firstItem.price) : 0;
        if (rank === 0) {
          rank = (firstItem.name && secondItem.name) ? getStringCompareResult(firstItem.name, secondItem.name) : 0;
        }
        return rank;
      });
      return reSortedArray;
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
    }

  };
})();
