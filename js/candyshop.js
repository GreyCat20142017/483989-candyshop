'use strict';

(function () {

  var initMessages = function () {
    var modals = document.querySelectorAll('.modal');
    return (modals.length === 2) ? {errorMessage: modals[0], successMessage: modals[1]} : null;
  };

  var tagMain = document.querySelector('main');
  var formFilter = window.dom.getElementBySelector(tagMain, '.catalog__sidebar > form');
  var rangeFilter = window.dom.getElementBySelector(formFilter, '.range__filter');
  var formBuy = window.dom.getElementBySelector(tagMain, '.buy > form');

  var links = {
    catalogContainer: document.querySelector('.catalog__cards'),
    catalogCardTemplate: window.dom.getTemplateContent('#card', '.catalog__card'),
    basketContainer: document.querySelector('.goods__cards'),
    basketCardTemplate: window.dom.getTemplateContent('#card-order', '.goods_card'),
    basketMainHeader: document.querySelector('.main-header__basket'),
    deliverContainer: window.dom.getElementBySelector(tagMain, '.deliver'),
    deliverButtons: window.dom.getElementBySelector(tagMain, '.deliver__toggle'),
    paymentContainer: window.dom.getElementBySelector(tagMain, '.payment'),
    paymentButtons: window.dom.getElementBySelector(tagMain, '.payment__method'),
    rangeFilter: rangeFilter,
    rangeLine: window.dom.getElementBySelector(rangeFilter, '.range__fill-line'),
    rangePinA: window.dom.getElementBySelector(rangeFilter, '.range__btn--left'),
    rangePinB: window.dom.getElementBySelector(rangeFilter, '.range__btn--right'),
    rangePriceMin: window.dom.getElementBySelector(tagMain, '.range__price--min'),
    rangePriceMax: window.dom.getElementBySelector(tagMain, '.range__price--max'),
    messages: initMessages(),
    formFilter: formFilter,
    formFilterInputs: formFilter.querySelectorAll('input'),
    formFilterPTag: window.dom.getElementBySelector(formFilter, '.range__price-count'),
    emptyFiltersTemplate: window.dom.getTemplateContent('#empty-filters', '.catalog__empty-filter'),
    formBuyInputs: formBuy.querySelectorAll('input'),
    goodsTotal: window.dom.getElementBySelector(formBuy, '.goods__total'),
    goodsTotalCount: window.dom.getElementBySelector(formBuy, '.goods__total-count'),
    goodsTotalPrice: window.dom.getElementBySelector(formBuy, '.goods__price'),
    goodsTotalAmount: window.dom.getElementBySelector(formBuy, '.goods__amount')
  };

  tagMain = null;
  rangeFilter = null;
  formFilter = null;
  formBuy = null;

  if (window.main) {
    window.main.initApp(links);
  };

})();
