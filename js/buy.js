'use strict';

(function () {
  var DELIVERY_CLASSES = {store: 'deliver__store', courier: 'deliver__courier'};
  var PAYMENT_CLASSES = {card: 'payment__card-wrap', cash: 'payment__cash-wrap'};

  var init = function (links) {
    var getLunaResult = function (text) {
      var result = text.replace(' ', '').split('').map(function (item, i) {
        return ((i + 1) % 2 === 0) ? parseInt(item, 10) : parseInt(item, 10) * 2;
      }).reduce(function (sum, current) {
        return sum + ((current >= 10) ? (current - 9) : current);
      }, 0);
      return ((result % 10) === 0);
    };

    var tabSwitchTo = function (className, container, classesObject) {
      Object.keys(classesObject).map(function (el) {
        return el;
      }).forEach(function (item) {
        var element = window.dom.getElementBySelector(container, '.' + classesObject[item]);
        if (element && element.classList.contains(className)) {
          window.general.removeClassName(element, 'visually-hidden');
        }
        if (element && !element.classList.contains(className)) {
          window.general.addClassName(element, 'visually-hidden');
        }
      });
    };

    var onDeliverButtonsClick = function (evt) {
      var el = evt.target;
      if ((el.tagName !== 'INPUT')) {
        return false;
      }
      if (el.name === 'method-deliver' && el.hasAttribute('id')) {
        tabSwitchTo(el.getAttribute('id'), links.deliverContainer, DELIVERY_CLASSES);
      }
      return false;
    };

    var onPaymentButtonsClick = function (evt) {
      var el = evt.target;
      if ((el.tagName !== 'INPUT')) {
        return false;
      }
      if (el.name === 'pay-method' && el.hasAttribute('id')) {
        tabSwitchTo(el.getAttribute('id') + '-wrap', links.paymentContainer, PAYMENT_CLASSES);
      }
      return false;
    };


    if (links.deliverButtons) {
      links.deliverButtons.addEventListener('click', onDeliverButtonsClick);
    }
    if (links.paymentButtons) {
      links.paymentButtons.addEventListener('click', onPaymentButtonsClick);
    }
  };


  window.buy = {
    init: init
  };

})();

