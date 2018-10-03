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

    getPhotosByRank: function (sourceArray) {
      var reSortedArray = sourceArray.slice().sort(function (firstItem, secondItem) {
        var rank = (firstItem.comments && secondItem.comments) ? (secondItem.comments.length - firstItem.comments.length) : 0;
        if (rank === 0) {
          rank = (firstItem.likes && secondItem.likes) ? (parseInt(secondItem.likes, 10) - parseInt(firstItem.likes, 10)) : 0;
        }
        if (rank === 0) {
          rank = (firstItem.url && secondItem.url) ? getStringCompareResult(firstItem.url, secondItem.url) : 0;
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
    }
  };
})();
