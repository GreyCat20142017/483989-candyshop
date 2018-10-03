'use strict';

(function () {
  window.general = {
    removeClassName: function (element, className) {
      if (element && element.classList.contains(className)) {
        element.classList.remove(className);
      }
    },

    addClassName: function (element, className) {
      if (element && !element.classList.contains(className)) {
        element.classList.add(className);
      }
    }
  };
})();
