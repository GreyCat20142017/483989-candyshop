'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var TAB_KEYCODE = 9;
  var DISABLED_TABINDEX = -1;
  var DEFAULT_TABINDEX = 0;
  var INCREASED_TABINDEX = 1;
  var MAX_TABINDEX = 2;

  window.general = {

    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        evt.preventDefault();
        action();
      }
    },

    isEvent: function (evt, action) {
      evt.preventDefault();
      action();
    },

    isPreventableTabEvent: function (evt) {
      if (evt.keyCode === TAB_KEYCODE) {
        evt.preventDefault();
      }
    },

    getDisabledTabIndex: function () {
      return DISABLED_TABINDEX;
    },

    getDefaultTabIndex: function () {
      return DEFAULT_TABINDEX;
    },

    getIncreasedTabIndex: function () {
      return INCREASED_TABINDEX;
    },

    getMaxTabIndex: function () {
      return MAX_TABINDEX;
    },

    resetTabIndex: function (newTabIndex, interactiveItems) {
      if (interactiveItems) {
        Array.prototype.slice.call(interactiveItems).forEach(function (item) {
          item.tabIndex = newTabIndex;
        });
      }
    },

  };
})();
