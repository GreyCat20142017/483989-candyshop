'use strict';

(function () {
  var DELIVERY_CLASSES = {store: 'deliver__store', courier: 'deliver__courier'};
  var PAYMENT_CLASSES = {card: 'payment__card-wrap', cash: 'payment__cash-wrap'};
  var MAP_IMAGE_INFO = {path: 'img/map/', extension: '.jpg'};

  var SPECIFIC_DEFAULT_VALUES = {'store': {value: 'academicheskaya'}};
  var CARD_VALIDATED_FIELDS = {'card-number': true, 'card-date': true, 'card-cvc': true, 'cardholder': true};
  var REST_VALIDATED_FIELDS = {'deliver-floor': true};
  var validationRules = {
    'card-number': {minLength: 16, maxLength: 16, customChecks: [], customErrorMessage: 'Номер карты должен быть длиной 16 символов и НЕ проходить проверку по алгоритму Луна'},
    'card-date': {minLength: 5, maxLength: 5, customChecks: [], customErrorMessage: 'Дата должна быть в формате ММ/ГГ, где месяц - 2 цифры от 01 до 12, а год 2 цифры от 18 до 29'},
    'card-cvc': {minLength: 3, maxLength: 3, customChecks: [], customErrorMessage: 'Валидный CVC - 3 цифры'},
    'cardholder': {minlength: 2, customChecks: [], customErrorMessage: 'Длина не менее двух символов (допустимы только латинские прописные буквы и пробел'},
    'deliver-floor': {customChecks: [], customErrorMessage: 'Этаж - не обязательное поле, но если оно заполнено, то это должно быть число  длиной 1-2 знака'}
  };

  var bus = window.mediator.bus;
  var events = window.candyevents;

  var init = function (links) {

    var getCardNumberValidationResult = function () {
      return !window.common.getLuhnResult(links.formPaymentDeliver['card-number'].value);
    };

    var getValidationResult = function () {
      var result = true;
      window.common.getKeysArrayFromObject(REST_VALIDATED_FIELDS).forEach(function (item) {
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
      links.formPaymentDeliverInputs.forEach(function (item) {
        if (item.tagName === 'INPUT' || item.tagName === 'TEXTAREA') {
          if (SPECIFIC_DEFAULT_VALUES[item.name]) {
            item.value = SPECIFIC_DEFAULT_VALUES[item.name].value;
          } else {
            item.value = '';
          }
        }
      });
      renderCardState(false);
    };

    var refineCustomValidity = function (item) {
      links.formPaymentDeliver[item].setCustomValidity('');
      var itemResult = validationRules[item].customChecks.length > 0 ? validationRules[item].customChecks[0]() : links.formPaymentDeliver[item].validity.valid;
      links.formPaymentDeliver[item].setCustomValidity(itemResult ? '' : validationRules[item].customErrorMessage);
      return itemResult;
    };

    var getSummaryCardValidationResult = function () {
      var cardValidationResult = true;
      if (links.formPaymentDeliver) {
        window.common.getKeysArrayFromObject(CARD_VALIDATED_FIELDS).forEach(function (item) {
          cardValidationResult = cardValidationResult && refineCustomValidity(item);
        });
      }
      return cardValidationResult;
    };

    var renderCardState = function (approved) {
      if (links.paymentCardStatus) {
        links.paymentCardStatus.textContent = approved ? 'Одобрен' : 'Не определен';
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

    var onFormChange = function (evt) {
      var element = evt.target;
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.name === 'store') {
          switchMap(element.value, getNextLabelText(element));
          return false;
        }
        if (!element.disabled && validationRules[element.name]) {
          if (validationRules[element.name]) {
            renderCardState(getSummaryCardValidationResult());
          }
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
      if (el.name === 'method-deliver' && el.hasAttribute('id')) {
        tabSwitchTo(el.getAttribute('id'), links.deliverContainer, DELIVERY_CLASSES);
        return false;
      }
      if (el.name === 'pay-method' && el.hasAttribute('id')) {
        tabSwitchTo(el.getAttribute('id') + '-wrap', links.paymentContainer, PAYMENT_CLASSES);
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
        var checkedStation = links.formPaymentDeliver.querySelector('[name="store"]:checked');
        if (checkedStation) {
          switchMap(checkedStation.value, getNextLabelText(checkedStation));
        }
        setInitialTabState();
      }
      bus.addEvent(events.SWITCH_ORDER_STATE, setDisableState);
      validationRules['card-number'].customChecks.push(getCardNumberValidationResult);
    };

    presetOrder();
  };

  window.order = {
    init: init
  };

})();
