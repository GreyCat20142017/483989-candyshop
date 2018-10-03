'use strict';

(function () {
  var ESC_KEYCODE = 27;

  window.events = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        evt.preventDefault();
        action();
      }
    },

    isEvent: function (evt, action) {
      evt.preventDefault();
      action();
    }
  };
})();
