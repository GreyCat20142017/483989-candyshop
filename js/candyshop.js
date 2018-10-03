'use strict';

(function () {

  var basketContainer = document.querySelector('.goods__cards');
  var basketElementTemplate = window.dom.getTemplateContent('#card-order', '.goods_card');
  var basketMainHeader = document.querySelector('.main-header__basket');

  var catalogContainer = document.querySelector('.catalog__cards');
  var catalogElementContainer = window.dom.getTemplateContent('#card', '.catalog__card');

  var deliverContainer = document.querySelector('.deliver');
  var deliverButtons = window.dom.getElementBySelector(deliverContainer, '.deliver__toggle');

  var paymentContainer = document.querySelector('.payment');
  var paymentButtons = window.dom.getElementBySelector(paymentContainer, '.payment__method');

  var rangeFilter = document.querySelector('.range__filter');
  var rangeLine = window.dom.getElementBySelector(rangeFilter, '.range__fill-line');
  var rangePinA = window.dom.getElementBySelector(rangeFilter, '.range__btn--left');
  var rangePinB = window.dom.getElementBySelector(rangeFilter, '.range__btn--right');

  var rangePriceMin = document.querySelector('.range__price--min');
  var rangePriceMax = document.querySelector('.range__price--max');

  var links = {
    basketContainer: basketContainer,
    basketElementTemplate: basketElementTemplate,
    basketMainHeader: basketMainHeader,
    catalogContainer: catalogContainer,
    catalogElementContainer: catalogElementContainer,
    deliverContainer: deliverContainer,
    deliverButtons: deliverButtons,
    paymentContainer: paymentContainer,
    paymentButtons: paymentButtons,
    rangeFilter: rangeFilter,
    rangeLine: rangeLine,
    rangePinA: rangePinA,
    rangePinB: rangePinB,
    rangePriceMin: rangePriceMin,
    rangePriceMax: rangePriceMax
  };

  window.goods(links);

})();
