'use strict';

(function () {
  var CARD_ID = 'data-id';

  var bus = window.mediator.bus;
  var events = window.candyevents;

  var init = function (links, catalogCards) {

    var createBasketCard = function (template, data) {
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

    var refreshBasketDependentStates = function (dataArray) {
      var basketTotals = getBasketTotal(dataArray);
      var textForm = window.common.getTextForm(basketTotals.amount, ['товар', 'товара', ' товаров']);
      if (links.basketMainHeader && links.goodsTotalPrice && links.goodsTotalAmount) {
        links.basketMainHeader.textContent = (basketTotals.amount === 0) ? 'В корзине ничего нет' : 'В корзине ' +  basketTotals.amount + ' '+ textForm;
        links.goodsTotalPrice.textContent = basketTotals.price + ' ₽';
        links.goodsTotalAmount.textContent = ' ' + basketTotals.amount + ' ' + textForm;
      }
    };

    var refreshBasketState = function (dataArray) {
      if (links.basketContainer) {
        if (dataArray.length === 1) {
          window.dom.removeClassName(links.basketContainer, '.goods__cards--empty');
          window.dom.addClassNameBySelector(links.basketContainer, '.goods__card-empty', 'visually-hidden');
          window.dom.removeClassName(links.goodsTotal, 'visually-hidden');
          setFieldsetDisabled(false);
        } else if (dataArray.length === 0) {
          window.dom.addClassName(links.basketContainer, '.goods__cards--empty');
          window.dom.removeClassNameBySelector(links.basketContainer, '.goods__card-empty', 'visually-hidden');
          window.dom.addClassName(links.goodsTotal,  'visually-hidden');
          setFieldsetDisabled(true);
        }
         refreshBasketDependentStates(dataArray);
      }
    };

    var renderBasket = function (dataArray, template, insertionPoint) {
      if (template && insertionPoint) {
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < dataArray.length; i++) {
          fragment.appendChild(createBasketCard(template, dataArray[i]));
        }
        insertionPoint.appendChild(fragment);
      }
      // refreshBasketState(dataArray);
    };


    var onBasketClick = function (evt) {
      var element = evt.target;
      var eventDescription = {wasButtonClicked: false, toBasket: true, wasLinkClicked: false};
      if ((element.tagName !== 'BUTTON') && (element.tagName !== 'ARTICLE') && (element.tagName !== 'A')) {
        return false;
      }
      evt.preventDefault();
      while (element !== links.basketContainer) {
        if (element.hasAttribute(CARD_ID) && eventDescription.wasButtonClicked) {
          if (eventDescription.toBasket) {
            addUnitToBasket(element.getAttribute(CARD_ID));
          } else {
            removeUnitFromBasket(element.getAttribute(CARD_ID), element, 1);
          }
          return false;
        }
        if (element.hasAttribute(CARD_ID) && eventDescription.wasLinkClicked) {
          removeUnitFromBasket(element.getAttribute(CARD_ID), element);
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
        if (element.classList.contains('card-order__close')) {
          eventDescription.toBasket = false;
          eventDescription.wasLinkClicked = true;
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

     var getBasketTotal = function (arr) {
      var totalAmount = arr.reduce(function (sum, current) {
        sum.amount += current.amount;
        sum.price += current.price * current.amount;
        return sum;
      }, {amount: 0, price: 0});
      return totalAmount;
    };


    var addUnitToBasket = function (cardID) {
      var target = {};
      var sourceIndex = window.common.getIndexByID(catalogCards, cardID);
      var targetIndex = window.common.getIndexByID(basketCards, cardID);
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
            renderBasket([target], links.basketCardTemplate, links.basketContainer);
          }
          refreshBasketState(basketCards);
          source.amount = source.amount - 1;
          checkCatalogAmount(source, cardID, false);
        }
      }
    };

    var removeUnitFromBasket = function (cardID, element, basketAmount) {
      var basketIndex = window.common.getIndexByID(basketCards, cardID);
      var catalogIndex = window.common.getIndexByID(catalogCards, cardID);
      if ((basketIndex >= 0) && (catalogIndex >= 0)) {
        var source = basketCards[basketIndex];
        if (source.amount > 0) {
          basketAmount = basketAmount ? basketAmount : source.amount;
          var target = catalogCards[catalogIndex];
          target.amount = target.amount + basketAmount;
          checkCatalogAmount(target, cardID, (Math.abs(basketAmount) === 1) ? false : true);
          source.amount = source.amount - basketAmount;
          window.dom.setAttributeBySelector(element, '.card-order__count', 'value', source.amount);
          if (source.amount === 0) {
            element.remove();
            basketCards.splice(basketIndex, 1);
          }
        }
        refreshBasketState(basketCards);
      }
    };

    var basketCards = [];
  };

  window.basket = {
    init: init
  }

})();
