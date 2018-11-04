'use strict';

(function () {
  var bus = window.mediator.bus;
  var events = window.candyevents;

  var initApp = function (links) {
    if (window.order) {
      window.order.init(links);
      bus.emitEvent(events.SWITCH_ORDER_STATE, {disabled: true, buttonDisabled: true});
    }
    if (window.catalog && window.basket) {
      window.catalog.init(links);
      window.basket.init(links);
    }
  };

  window.main = {
    initApp: initApp
  };

})();
