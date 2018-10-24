'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var TAB_KEYCODE = 9;

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
    }

  };
})();
