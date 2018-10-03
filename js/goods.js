'use strict';

(function () {
  var STAR_CLASSES = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three',
    'stars__rating--four', 'stars__rating--five'];
  var CARD_CLASSES = {stock: 'card--in-stock', little: 'card--little', soon: 'card--soon'};
  var CARD_CLASSES_UPPER_BORDER = 5;
  var CARD_CLASSES_LOW_BORDER = 0;
  var CHARACTERISTICS = ['Без сахара', 'Содержит сахар'];
  var IMG_PATH = 'img/cards/';
  var CARD_ID = 'data-id';

  window.goods = function (links) {

    var getClassNameByAmount = function (amount) {
      if (amount > CARD_CLASSES_UPPER_BORDER) {
        return CARD_CLASSES.stock;
      }
      if (amount === CARD_CLASSES_LOW_BORDER) {
        return CARD_CLASSES.soon;
      }
      return CARD_CLASSES.little;
    };

    var getClassNameByRating = function (ratingValue) {
      return ((ratingValue >= 1) && (ratingValue <= STAR_CLASSES.length)) ? STAR_CLASSES[ratingValue - 1] : '';
    };

    var getCharacteristicText = function (sugarValue) {
      var ind = Number(sugarValue);
      return ((ind >= 0) && (ind < STAR_CLASSES.length)) ? CHARACTERISTICS[ind] : '';
    };

    var changeFirstNumericDataWithoutOwnTag = function (element, selector, value) {
      var block = element.querySelector(selector);
      if (block) {
        block.innerHTML = block.innerHTML.replace(/\d*\s/, parseInt('' + value, 10));
      }
    };

    var createCatalogElement = function (template, data) {
      var element = template.cloneNode(true);
      var header = element.querySelector('.card__header');
      var btnWrapper = element.querySelector('.card__btns-wrap');
      window.dom.setAttributeBySelector(header, '.card__title', 'textContent', data.name);
      window.dom.setAttributeBySelector(header, 'img', 'src', IMG_PATH + data.picture);
      window.dom.setAttributeBySelector(header, 'img', 'alt', data.name);
      changeFirstNumericDataWithoutOwnTag(element, '.card__price', data.price);
      window.dom.setAttributeBySelector(element, '.card__weight', 'textContent', data.weight);
      window.dom.setAttributeBySelector(element, '.star__count', 'textContent', data.rating.number);
      window.dom.setAttributeBySelector(element, '.card__characteristic', 'textContent', getCharacteristicText(data.nutritionFacts.sugar));
      window.dom.setAttributeBySelector(element, '.card__composition-list', 'textContent', data.nutritionFacts.content);
      window.dom.replaceClassNameByObject(element, getClassNameByAmount(data.amount), CARD_CLASSES);
      window.dom.replaceClassNameBySelector(element, '.stars__rating', getClassNameByRating(data.rating.value), STAR_CLASSES);
      element.setAttribute(CARD_ID, data.id);
      btnWrapper.setAttribute(CARD_ID, data.id);
      return element;
    };

    var renderCatalog = function (dataArray) {
      var template = links.catalogElementContainer;
      var insertionPoint = links.catalogContainer;
      if (template && insertionPoint) {
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < dataArray.length; i++) {
          fragment.appendChild(createCatalogElement(template, dataArray[i]));
        }
        insertionPoint.appendChild(fragment);
      }
      window.general.removeClassName(insertionPoint, '.catalog__cards--load');
      window.dom.addClassNameBySelector(insertionPoint, '.catalog__load', 'visually-hidden');
    };

    var createBasketElement = function (template, data) {
      var element = template.cloneNode(true);
      var orderHeader = element.querySelector('.card-order__header');
      window.dom.setAttributeBySelector(orderHeader, '.card-order__title', 'textContent', data.name);
      window.dom.setAttributeBySelector(orderHeader, 'img', 'src', IMG_PATH + data.picture);
      window.dom.setAttributeBySelector(orderHeader, 'img', 'alt', data.name);
      changeFirstNumericDataWithoutOwnTag(element, '.card-order__price', data.price);
      window.dom.setAttributeBySelector(element, '.card-order__count', 'value', data.amount);
      element.setAttribute(CARD_ID, data.id);
      return element;
    };

    var renderBasket = function (dataArray) {
      var template = links.basketElementTemplate;
      var insertionPoint = links.basketContainer;
      if (template && insertionPoint) {
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < dataArray.length; i++) {
          fragment.appendChild(createBasketElement(template, dataArray[i]));
        }
        insertionPoint.appendChild(fragment);
      }
      if (dataArray.length !== 0) {
        window.general.removeClassName(insertionPoint, '.goods__cards--empty');
        window.dom.addClassNameBySelector(insertionPoint, '.goods__card-empty', 'visually-hidden');
      } else {
        window.general.addClassName(insertionPoint, '.goods__cards--empty');
        window.dom.removeClassNameBySelector(insertionPoint, '.goods__card-empty', 'visually-hidden');
      }
    };

    var onCatalogClick = function (evt) {
      var element = evt.target;
      if (element.tagName !== 'A') {
        return false;
      }
      evt.preventDefault();
      while (element !== links.catalogContainer) {
        if (element.classList.contains('card__btn-favorite') && element.parentElement.hasAttribute(CARD_ID)) {
          element.classList.toggle('card__btn-favorite--selected');
          return false;
        }
        if (element.classList.contains('card__btn') && element.parentElement.hasAttribute(CARD_ID)) {
          addUnitToBasket(element.parentElement.getAttribute(CARD_ID));
          return false;
        }
        element = element.parentNode;
      }
      return false;
    };

    var onBasketClick = function (evt) {
      var element = evt.target;
      var eventDescription = {wasButtonClicked: false, toBasket: true};
      if ((element.tagName !== 'BUTTON') && (element.tagName !== 'ARTICLE')) {
        return false;
      }
      evt.preventDefault();
      while (element !== links.basketContainer) {
        if (element.hasAttribute(CARD_ID) && eventDescription.wasButtonClicked) {
          if (eventDescription.toBasket) {
            addUnitToBasket(element.getAttribute(CARD_ID));
          } else {
            removeUnitFromBasket(element.getAttribute(CARD_ID), element);
          }
          return false;
        }
        if (element.classList.contains('card-order__btn--decrease')) {
          eventDescription.toBasket = false;
          eventDescription.wasButtonClicked = true;
        }
        if (element.classList.contains('card-order__btn--increase')) {
          eventDescription.toBasket = true;
          eventDescription.wasButtonClicked = true;
        }
        element = element.parentNode;
      }
      return false;
    };

    var getMainBasketHeaderText = function (arr) {
      var totalAmount = arr.reduce(function (sum, current) {
        return sum + current.amount;
      }, 0);
      return (totalAmount === 0) ? 'В корзине ничего нет' : 'В корзине ' + totalAmount + ' ' + window.common.getTextForm(totalAmount, ['товар', 'товара', ' товаров']);
    };

    var getIndexByID = function (arr, ind) {
      return arr.indexOf(arr.filter(function (item) {
        return item.id === ind;
      })[0]);
    };

    var checkCatalogAmount = function (source, ind) {
      if ((source.amount <= CARD_CLASSES_LOW_BORDER) || (source.amount === CARD_CLASSES_UPPER_BORDER)) {
        var element = window.dom.getElementBySelector(links.catalogContainer, '.catalog__card[data-id="' + ind + '"]');
        window.dom.replaceClassNameByObject(element, getClassNameByAmount(source.amount), CARD_CLASSES);
      }
    };

    var checkBasketAmount = function (source, ind) {
      if (source.amount <= 0) {
        var element = window.dom.getElementBySelector(links.basketContainer, '.goods_card[data-id="' + ind + '"]');
        element.parentElement.removeChild(element);
      }
    };

    var addUnitToBasket = function (cardID) {
      var target = {};
      var sourceIndex = getIndexByID(catalogCards, cardID);
      var targetIndex = getIndexByID(basketCards, cardID);
      if (sourceIndex >= 0) {
        var source = catalogCards[sourceIndex];
        if (source.amount > 0) {
          if (targetIndex >= 0) {
            target = basketCards[targetIndex];
            target.amount = (target.amount) ? (target.amount + 1) : 1;
            var itemSelector = '.goods_card[data-id="' + cardID + '"] .card-order__count';
            window.dom.setAttributeBySelector(links.basketContainer, itemSelector, 'value', target.amount);
          } else {
            target = Object.assign({}, source);
            target.amount = 1;
            basketCards.push(target);
            renderBasket([target]);
          }
          links.basketMainHeader.textContent = getMainBasketHeaderText(basketCards);
          source.amount = source.amount - 1;
          checkCatalogAmount(source, cardID);
        }
      }
    };

    var removeUnitFromBasket = function (cardID, element) {

    };

    var initCatalog = function () {
      renderCatalog(catalogCards);
      renderBasket(basketCards);
      if (window.hasOwnProperty('backend')) {
        window.backend.getData(onGet, onGetError);
      }
      if (links.catalogContainer) {
        links.catalogContainer.addEventListener('click', onCatalogClick);
      }
      if (links.basketContainer) {
        links.basketContainer.addEventListener('click', onBasketClick);
      }
      if (window.hasOwnProperty('form')) {
        window.form.init(links);
      }
      if (window.hasOwnProperty('slider')) {
        window.slider.init(links);
      }
    };

    var onGet = function (response) {
      catalogCards = [];
      response.forEach(function (item, index) {
        item.id = 'id-' + index;
        catalogCards.push(item);
      });
      renderCatalog(catalogCards);
      // initFilter();
      // renderPhotosByFilter(FILTERS.popular);
    };

    var onGetError = function (errorMessage) {
      // window.message.init(messages.errorMessage, errorMessage, true);
    };


    var catalogCards = [];
    var basketCards = [];

    initCatalog();

  };

})();


