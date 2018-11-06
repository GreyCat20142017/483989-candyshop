'use strict';

(function () {
  var MAP_IMAGE_INFO = {path: 'img/map/', extension: '.jpg'};
  var DELIVERY_CLASSES = {store: 'deliver__store', courier: 'deliver__courier'};
  var PAYMENT_CLASSES = {card: 'payment__card-wrap', cash: 'payment__cash-wrap'};
  var PAYMENT_WRAPPER_SUFFIX = '-wrap';
  var TABS = {deliveryTab: 'method-deliver', payTab: 'pay-method'};
  var TAB_ID = 'id';

  var STORES_ELEMENT_NAME = 'store';
  var CARD_STATES = {approved: 'Одобрен', unknown: 'Не определен'};
  var VALIDATED_FIELDS = {
    cardNumber: {name: 'card-number', validationRule: {minLength: 16, maxLength: 16, customChecks: [], customErrorMessage: 'Номер карты должен быть длиной 16 символов и НЕ проходить проверку по алгоритму Луна'}},
    cardDate: {name: 'card-date', validationRule: {minLength: 5, maxLength: 5, customChecks: [], customErrorMessage: 'Дата должна быть в формате ММ/ГГ, где месяц - 2 цифры от 01 до 12, а год 2 цифры от 18 до 29'}},
    cardCvc: {name: 'card-cvc', validationRule: {minLength: 3, maxLength: 3, customChecks: [], customErrorMessage: 'Валидный CVC - 3 цифры'}},
    cardHolder: {name: 'cardholder', validationRule: {minlength: 2, customChecks: [], customErrorMessage: 'Длина не менее двух символов (допустимы только латинские прописные буквы и пробел'}},
    deliverFloor: {name: 'deliver-floor', validationRule: {customChecks: [], customErrorMessage: 'Этаж - не обязательное поле, но если оно заполнено, то это должно быть число  длиной 1-2 знака'}}
  };

  var CARD_VALIDATED_FIELDS = [VALIDATED_FIELDS.cardNumber, VALIDATED_FIELDS.cardDate, VALIDATED_FIELDS.cardCvc, VALIDATED_FIELDS.cardHolder];
  var REST_VALIDATED_FIELDS = [VALIDATED_FIELDS.deliverFloor];

  var cardFieldsNames = CARD_VALIDATED_FIELDS.map(function (item) {
    return item.name;
  });

  var bus = window.mediator.bus;
  var events = window.candyevents;

  var init = function (links) {

    var getCardNumberValidationResult = function () {
      return !window.common.getLuhnResult(links.formPaymentDeliver[VALIDATED_FIELDS.cardNumber.name].value);
    };

    var getValidationResult = function () {
      var result = true;
      REST_VALIDATED_FIELDS.forEach(function (item) {
        refineCustomValidity(item);
      });
      links.formPaymentDeliverInputs.forEach(function (item) {
        if (!item.disabled) {
          result = result && item.validity.valid;
        }
      });
      return result;
    };

    var resetFormInputs = function () {
      if (links.deliverDefaultStore) {
        links.deliverDefaultStore.checked = true;
      }
      links.formPaymentDeliverInputs.forEach(function (item) {
        if ((item.tagName === 'INPUT' && item.type.toUpperCase() !== 'RADIO') || item.tagName === 'TEXTAREA') {
          item.value = '';
        }
      });
      renderCardState(false);
    };

    var refineCustomValidity = function (item) {
      links.formPaymentDeliver[item.name].setCustomValidity('');
      var itemResult = item.validationRule.customChecks.length > 0 ? item.validationRule.customChecks[0] : links.formPaymentDeliver[item.name].validity.valid;
      links.formPaymentDeliver[item.name].setCustomValidity(itemResult ? '' : item.validationRule.customErrorMessage);
      return itemResult;
    };

    var getSummaryCardValidationResult = function () {
      var cardValidationResult = true;
      if (links.formPaymentDeliver) {
        CARD_VALIDATED_FIELDS.forEach(function (item) {
          cardValidationResult = cardValidationResult && refineCustomValidity(item);
        });
      }
      return cardValidationResult;
    };

    var renderCardState = function (approved) {
      if (links.paymentCardStatus) {
        links.paymentCardStatus.textContent = approved ? CARD_STATES.approved : CARD_STATES.unknown;
      }
    };

    var getNextLabelText = function (element) {
      var nextElement = element.nextElementSibling;
      return (nextElement && nextElement.tagName === 'LABEL') ? nextElement.textContent : element.value.toString();
    };

    var switchMap = function (station, description) {
      if (links.deliverMap) {
        links.deliverMap.src = MAP_IMAGE_INFO.path + station + MAP_IMAGE_INFO.extension;
        links.deliverMap.alt = description;
        if (links.deliverMapDescription) {
          links.deliverMapDescription.textContent = description;
        }
      }
    };

    var getCardFieldAffiliation = function (fieldName) {
      return (cardFieldsNames.indexOf(fieldName) >= 0);
    };

    var onFormChange = function (evt) {
      var element = evt.target;
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.name === STORES_ELEMENT_NAME) {
          switchMap(element.value, getNextLabelText(element));
          return false;
        }

        if (!element.disabled && getCardFieldAffiliation(element.name)) {
          renderCardState(getSummaryCardValidationResult());
          return false;
        }
      }
      return false;
    };

    var onPostDataError = function (errorMessage) {
      window.message.init(links.messages.errorMessage, errorMessage);
    };

    var onPostData = function () {
      window.message.init(links.messages.successMessage, 'Данные успешно отправлены', document.activeElement);
      resetFormInputs();
      bus.emitEvent(events.RESET_BASKET);
    };

    var onFormSubmit = function (evt) {
      evt.preventDefault();
      if (getValidationResult()) {
        if (window.backend) {
          window.backend.postData(new FormData(links.form), onPostData, onPostDataError);
        }
      }
    };

    var setButtonDisableState = function (buttonDisabled) {
      var orderButtonDisabledClassName = 'goods__order-link--disabled';
      if (links.orderLink) {
        var nowDisabled = links.orderLink.classList.contains(orderButtonDisabledClassName);
        if (buttonDisabled !== nowDisabled) {
          window.dom[buttonDisabled ? 'addClassName' : 'removeClassName'](links.orderLink, orderButtonDisabledClassName);
        }
      }
    };

    var setDisableState = function (data) {
      setButtonDisableState(data.buttonDisabled);
      if (data.disabled === data.buttonDisabled) {
        if (links.formPaymentDeliverInputs) {
          window.common.getArrayFromCollection(links.formPaymentDeliverInputs).forEach(function (element) {
            element.disabled = data.disabled;
          });
        }
        if (!data.disabled) {
          setInitialTabState();
        }
      }
    };

    var tabSwitchTo = function (className, container, classesObject) {
      window.common.getKeysArrayFromObject(classesObject).forEach(function (item) {
        var element = window.dom.getElementBySelector(container, '.' + classesObject[item]);
        var inputs = element.querySelectorAll('input, textarea');
        if (element) {
          var result = element.classList.contains(className);
          window.dom[result ? 'removeClassName' : 'addClassName'](element, 'visually-hidden');
          window.common.getArrayFromCollection(inputs).forEach(function (input) {
            input.disabled = !result;
          });
        }
      });
    };

    var onOrderClick = function (evt) {
      evt.preventDefault();
      setDisableState({disabled: false, buttonDisabled: false});
      window.dom.setFocusOnObject(links.formPaymentDeliverInputs[0]);
    };

    var onTabButtonsClick = function (evt) {
      var el = evt.target;
      if ((el.tagName !== 'INPUT')) {
        return false;
      }
      if (el.name === TABS.deliveryTab && el.hasAttribute(TAB_ID)) {
        tabSwitchTo(el.getAttribute(TAB_ID), links.deliverContainer, DELIVERY_CLASSES);
        return false;
      }
      if (el.name === TABS.payTab && el.hasAttribute(TAB_ID)) {
        tabSwitchTo(el.getAttribute(TAB_ID) + PAYMENT_WRAPPER_SUFFIX, links.paymentContainer, PAYMENT_CLASSES);
        return false;
      }
      return false;
    };

    var setInitialTabState = function () {
      tabSwitchTo(PAYMENT_CLASSES.card, links.paymentContainer, PAYMENT_CLASSES);
      tabSwitchTo(DELIVERY_CLASSES.store, links.deliverContainer, DELIVERY_CLASSES);
    };

    var presetOrder = function () {
      if (links.deliverButtons) {
        links.deliverButtons.addEventListener('click', onTabButtonsClick);
      }
      if (links.paymentButtons) {
        links.paymentButtons.addEventListener('click', onTabButtonsClick);
      }
      if (links.orderLink) {
        links.orderLink.addEventListener('click', onOrderClick);
      }
      if (links.formPaymentDeliver) {
        links.formPaymentDeliver.addEventListener('change', onFormChange);
        links.formPaymentDeliver.addEventListener('submit', onFormSubmit);
        var checkedStation = links.formPaymentDeliver.querySelector('[name=' + STORES_ELEMENT_NAME + ']:checked');
        if (checkedStation) {
          switchMap(checkedStation.value, getNextLabelText(checkedStation));
        }
        setInitialTabState();
      }
      bus.addEvent(events.SWITCH_ORDER_STATE, setDisableState);
      VALIDATED_FIELDS.cardNumber.validationRule.customChecks.push(getCardNumberValidationResult);
    };

    presetOrder();
  };

  window.order = {
    init: init
  };

})();
