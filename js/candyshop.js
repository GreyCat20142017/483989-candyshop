'use strict';

(function () {
  var MODULES = ['common', 'general', 'dom', 'mediator', 'candyevents', 'backend', 'main' , 'catalog', 'basket', 'order'];

  var checkModuleAddition = function () {
    return !MODULES.some(function (item) {
      return !window.hasOwnProperty(item);
    });
  };

  var initMessages = function () {
    var modals = document.querySelectorAll('.modal');
    return (modals.length === 2) ? {errorMessage: modals[0], successMessage: modals[1]} : null;
  };

  var tagMain = document.querySelector('main');
  var formFilter = window.dom.getElementBySelector(tagMain, '.catalog__sidebar > form');
  var rangeFilter = window.dom.getElementBySelector(formFilter, '.range');
  var formPaymentDeliver = window.dom.getElementBySelector(tagMain, '.buy > form');
  var deliverContainer = window.dom.getElementBySelector(tagMain, '.deliver');
  var paymentContainer = window.dom.getElementBySelector(tagMain, '.payment');

  var links = {
    catalogContainer: document.querySelector('.catalog__cards'),
    catalogCardTemplate: window.dom.getTemplateContent('#card', '.catalog__card'),
    basketContainer: window.dom.getElementBySelector(formPaymentDeliver, '.goods__cards'),
    basketCardTemplate: window.dom.getTemplateContent('#card-order', '.goods_card'),
    basketMainHeader: document.querySelector('.main-header__basket'),
    orderLink: window.dom.getElementBySelector(formPaymentDeliver, '.goods__order-link'),
    formPaymentDeliver: formPaymentDeliver,
    formPaymentDeliverInputs: formPaymentDeliver.querySelectorAll('input, textarea'),
    paymentContainer: paymentContainer,
    paymentButtons: window.dom.getElementBySelector(paymentContainer, '.payment__method'),
    paymentCardStatus: window.dom.getElementBySelector(paymentContainer, '.payment__card-status'),
    deliverContainer: deliverContainer,
    deliverButtons: window.dom.getElementBySelector(deliverContainer, '.deliver__toggle'),
    deliverMap: window.dom.getElementBySelector(deliverContainer, '.deliver__store-map-img'),
    deliverMapDescription: window.dom.getElementBySelector(deliverContainer, '.deliver__store-describe'),
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
    goodsTotal: window.dom.getElementBySelector(formPaymentDeliver, '.goods__total'),
    goodsTotalCount: window.dom.getElementBySelector(formPaymentDeliver, '.goods__total-count'),
    goodsTotalPrice: window.dom.getElementBySelector(formPaymentDeliver, '.goods__price'),
    goodsTotalAmount: window.dom.getElementBySelector(formPaymentDeliver, '.goods__amount')
  };

  if (checkModuleAddition()) {
    window.main.initApp(links);
  } else {
    if (window.message) {
      window.message.init(null, '', document.activeElement, {title: 'Произошла ошибка', composition: 'Не удалось загрузить все необходимые модули',
        properties: 'Функциональность приложения отключена', insertionPoint: tagMain, fixed: true});
    }
  }

  tagMain = null;
  rangeFilter = null;
  formFilter = null;
  formPaymentDeliver = null;
  deliverContainer = null;
  paymentContainer = null;

})();
