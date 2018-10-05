'use strict';

(function () {

  var initMessages = function () {
    var modals = document.querySelectorAll('.modal');
    return (modals.length === 2) ? {errorMessage: modals[0], successMessage: modals[1]} : null;
  };

  var main = document.querySelector('main');
  var rangeFilter = window.dom.getElementBySelector(main, '.range__filter');

  var links = {
    catalogContainer: document.querySelector('.catalog__cards'),
    catalogCardTemplate: window.dom.getTemplateContent('#card', '.catalog__card'),
    basketContainer: document.querySelector('.goods__cards'),
    basketCardTemplate: window.dom.getTemplateContent('#card-order', '.goods_card'),
    basketMainHeader: document.querySelector('.main-header__basket'),
    deliverContainer: window.dom.getElementBySelector(main, '.deliver'),
    deliverButtons: window.dom.getElementBySelector(main, '.deliver__toggle'),
    paymentContainer: window.dom.getElementBySelector(main, '.payment'),
    paymentButtons: window.dom.getElementBySelector(main, '.payment__method'),
    rangeFilter: window.dom.getElementBySelector(main, '.range__filter'),
    rangeLine: window.dom.getElementBySelector(rangeFilter, '.range__fill-line'),
    rangePinA: window.dom.getElementBySelector(rangeFilter, '.range__btn--left'),
    rangePinB: window.dom.getElementBySelector(rangeFilter, '.range__btn--right'),
    rangePriceMin: window.dom.getElementBySelector(main, '.range__price--min'),
    rangePriceMax: window.dom.getElementBySelector(main, '.range__price--min'),
    messages: initMessages()
  };

  main = null;
  rangeFilter = null;

  window.goods(links);

})();
