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

  var bus = window.mediator.bus;
  var events = window.candyevents;

  var init = function (links) {

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

    var createCatalogCard = function (template, data) {
      var element = template.cloneNode(true);
      var header = element.querySelector('.card__header');
      window.dom.setAttributeBySelector(header, '.card__title', 'textContent', data.name);
      window.dom.setAttributeBySelector(header, 'img', 'src', IMG_PATH + data.picture);
      window.dom.setAttributeBySelector(header, 'img', 'alt', data.name);
      window.dom.changeFirstNumericDataWithoutOwnTag(element, '.card__price', data.price);
      window.dom.setAttributeBySelector(element, '.card__weight', 'textContent', data.weight);
      window.dom.setAttributeBySelector(element, '.star__count', 'textContent', data.rating.number);
      window.dom.setAttributeBySelector(element, '.card__characteristic', 'textContent', getCharacteristicText(data.nutritionFacts.sugar));
      window.dom.setAttributeBySelector(element, '.card__composition-list', 'textContent', data.nutritionFacts.content);
      window.dom.replaceClassNameByObject(element, getClassNameByAmount(data.amount), CARD_CLASSES);
      window.dom.replaceClassNameBySelector(element, '.stars__rating', getClassNameByRating(data.rating.value), STAR_CLASSES);
      element.setAttribute(CARD_ID, data.id);
      window.dom.setAttributeBySelector(element, '.card__btn-composition', CARD_ID, data.id);
      window.dom.setAttributeBySelector(element, '.card__btns-wrap', CARD_ID, data.id);
      return element;
    };

    var renderCatalog = function (dataArray, template, insertionPoint) {
      if (template && insertionPoint) {
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < dataArray.length; i++) {
          fragment.appendChild(createCatalogCard(template, dataArray[i]));
        }
        insertionPoint.innerHTML = '';
        insertionPoint.appendChild(fragment);
      }
      window.dom.removeClassName(insertionPoint, '.catalog__cards--load');
      window.dom.addClassNameBySelector(insertionPoint, '.catalog__load', 'visually-hidden');
    };

    var renderCatalogMessage = function (template, insertionPoint) {
      if (template && insertionPoint) {
        insertionPoint.innerHTML = '';
        insertionPoint.appendChild(template);
      }
      window.dom.removeClassName(insertionPoint, '.catalog__cards--load');
      window.dom.addClassNameBySelector(insertionPoint, '.catalog__load', 'visually-hidden');
    };

    var showComposition = function (cardID) {
      var catalogIndex = window.common.getIndexByID(window.catalog.cards, cardID);
      if (catalogIndex >= 0) {
        var currentFacts = window.catalog.cards[catalogIndex].nutritionFacts;
        var composition = currentFacts.contents;
        var properties = '' + (currentFacts.sugar ? 'C сахаром, ' : 'Без сахара, ') +
          (currentFacts.gluten ? 'c глютеном, ' : 'без глютена, ') +
          (currentFacts.vegetarian ? 'вегетаринское' : 'не вегетаринское. ') +
          'Энергетическая ценность: ' + currentFacts.energy + '.';
        console.log(window.catalog.cards[catalogIndex].name + '. ' + 'Состав продукта: ' + composition + '.  Свойства продукта: ' + properties);
      }
    };

    var onCatalogClick = function (evt) {
      var element = evt.target;
      if ((element.tagName !== 'A') && (element.tagName !== 'BUTTON')) {
        return false;
      }
      evt.preventDefault();
      while (element !== links.catalogContainer) {
        if (element.classList.contains('card__btn-favorite') && element.parentElement.hasAttribute(CARD_ID)) {
          element.classList.toggle('card__btn-favorite--selected');
          switchCardSelected(element.parentElement.getAttribute(CARD_ID));
          return false;
        }
        if (element.classList.contains('card__btn') && element.parentElement.hasAttribute(CARD_ID)) {
          moveUnitToBasket(element.parentElement.getAttribute(CARD_ID));
          return false;
        }
        if (element.classList.contains('card__btn-composition') && element.hasAttribute(CARD_ID)) {
          showComposition(element.getAttribute(CARD_ID));
          return false;
        }
        element = element.parentNode;
      }
      return false;
    };

    var checkCatalogAmount = function (dataRecord, ind, anyway) {
      if (anyway || (dataRecord.amount >= CARD_CLASSES_LOW_BORDER) && (dataRecord.amount <= (CARD_CLASSES_UPPER_BORDER + 1))) {
        var element = window.dom.getElementBySelector(links.catalogContainer, '.catalog__card[data-id="' + ind + '"]');
        window.dom.replaceClassNameByObject(element, getClassNameByAmount(dataRecord.amount), CARD_CLASSES);
      }
    };

    var switchCardSelected = function (cardID) {
      var catalogIndex = window.common.getIndexByID(window.catalog.cards, cardID);
      window.catalog.cards[catalogIndex].selected = !(window.catalog.cards[catalogIndex].selected);
    };

    var moveUnitToBasket = function (cardID) {
      var catalogIndex = window.common.getIndexByID(window.catalog.cards, cardID);
      if (catalogIndex >= 0) {
        var source = window.catalog.cards[catalogIndex];
        if (source.amount > 0) {
          source.amount = source.amount - 1;
          checkCatalogAmount(source, cardID, false);
          bus.emitEvent(events.ADD_TO_BASKET, {cardID: cardID, amount: 1, source: source});
        }
      }
    };

    var moveUnitFromBasket = function (data) {
      var catalogIndex = window.common.getIndexByID(window.catalog.cards, data.cardID);
      if (catalogIndex >= 0) {
        var target = window.catalog.cards[catalogIndex];
        target.amount = target.amount + data.amount;
        checkCatalogAmount(target, data.cardID, (Math.abs(data.amount) === 1) ? false : true);
      }
    };

    var isMatch = function (filterElement, card) {
      var matchResult = false;
      switch (filterElement.filterType) {
        case 'food-type':
          matchResult = (filterElement.name === card.kind);
          break;
        case 'food-property':
          var propertyName = filterElement.keyProperty.replace('-free', '');
          matchResult = ((propertyName === filterElement.keyProperty) ? card.nutritionFacts[propertyName] : !card.nutritionFacts[propertyName]);
          break;
        case 'mark':
          if (filterElement.keyProperty === 'availability') {
            matchResult = (card.amount > 0);
          }
          if (filterElement.keyProperty === 'favorite') {
            matchResult = (card.selected);
          }
          break;
        default:
          break;
      }
      return matchResult;
    };

    var getMatchResult = function (card, userFilter) {
      var checkedFilters = userFilter.state;
      if (checkedFilters.mark.length > 0) {
        return isMatch(userFilter.description[checkedFilters['mark'][0]], card);
      } else {
        var result = checkedFilters['food-type'].length === 0 ? true : false;
        for (var i = 0; i < checkedFilters['food-type'].length; i++) {
          result = result || isMatch(userFilter.description[checkedFilters['food-type'][i]], card);
        }
        for (i = 0; i < checkedFilters['food-property'].length; i++) {
          result = result && isMatch(userFilter.description[checkedFilters['food-property'][i]], card);
        }
        result = result && (card.price >= checkedFilters.price.min) && (card.price <= checkedFilters.price.max);
        return result;
      }
    };

    var renderCatalogByFilter = function (userFilter) {
      window.catalog.cardsByConditions = (!userFilter || userFilter.length === 0) ? window.catalog.cards.slice() : window.catalog.cards.filter(function (card) {
        return getMatchResult(card, userFilter);
      });
      if (window.catalog.cardsByConditions.length === 0) {
        renderCatalogMessage(links.emptyFiltersTemplate, links.catalogContainer);
      } else {
        renderCatalog(window.catalog.cardsByConditions, links.catalogCardTemplate, links.catalogContainer);
      }
    };

    var onFilterChange = function (userFilter) {
      renderCatalogByFilter(userFilter);
      onSortChange(userFilter);
    };

    var onSortChange = function (userFilter) {
      switch (userFilter.sort) {
        case 'popular' :
          renderCatalog(window.catalog.cardsByConditions, links.catalogCardTemplate, links.catalogContainer);
          break;
        case 'expensive' :
          renderCatalog(getCardsByPrice(window.catalog.cardsByConditions, false), links.catalogCardTemplate, links.catalogContainer);
          break;
        case 'cheep' :
          renderCatalog(getCardsByPrice(window.catalog.cardsByConditions, true), links.catalogCardTemplate, links.catalogContainer);
          break;
        case 'rating' :
          renderCatalog(getCardsByRating(window.catalog.cardsByConditions), links.catalogCardTemplate, links.catalogContainer);
          break;
        default:
          renderCatalog(window.catalog.cardsByConditions, links.catalogCardTemplate, links.catalogContainer);
          break;
      }
    };

    var getCardsByRating = function (sourceArray) {
      var reSortedArray = sourceArray.slice().sort(function (firstItem, secondItem) {
        var rank = secondItem.rating.value - firstItem.rating.value;
        if (rank === 0) {
          rank = secondItem.rating.number - firstItem.rating.number;
        }
        if (rank === 0) {
          rank = (firstItem.name && secondItem.name) ? window.common.getStringCompareResult(firstItem.name, secondItem.name) : 0;
        }
        return rank;
      });
      return reSortedArray;
    };

    var getCardsByPrice = function (sourceArray, ascending) {
      var reSortedArray = sourceArray.slice().sort(function (firstItem, secondItem) {
        var rank = (secondItem.price - firstItem.price) * (ascending ? (-1) : 1);
        if (rank === 0) {
          rank = window.common.getStringCompareResult(firstItem.name, secondItem.name);
        }
        return rank;
      });
      return reSortedArray;
    };

    var onRequestFromFilter = function () {
      bus.emitEvent(events.ANSWER_CATALOG_FILTER, window.catalog.cards);
    };

    var onGetData = function (response) {
      var catalogCards = [];
      var maxValue = 0;
      response.forEach(function (item, index) {
        item.id = 'id-' + index;
        item.selected = false;
        catalogCards.push(item);
        maxValue = item.price > maxValue ? item.price : maxValue;
      });

      window.catalog.cards = catalogCards.slice();
      bus.emitEvent(events.FILTER_INIT, {min: 0, max: maxValue, upperBound: maxValue});
      renderCatalogByFilter(null);
    };

    var onGetDataError = function (errorMessage) {
      window.message.init(links.messages.errorMessage, errorMessage, document.activeElement);
    };

    var initCatalog = function () {
      if (links.catalogContainer) {
        bus.addEvent(events.ADD_FROM_BASKET, moveUnitFromBasket);
        bus.addEvent(events.REQUEST_TO_BASKET, moveUnitToBasket);
        bus.addEvent(events.CHANGE_FILTER, renderCatalogByFilter);
        bus.addEvent(events.REQUEST_FILTER_CATALOG, onRequestFromFilter);
        bus.addEvent(events.CHANGE_FILTER, onFilterChange);
        bus.addEvent(events.CHANGE_SORT, onSortChange);
        links.catalogContainer.addEventListener('click', onCatalogClick);
      }

      if (window.backend) {
        window.backend.getData(onGetData, onGetDataError);
      }
      if (window.slider) {
        window.slider.init(links);
      }
      if (window.filter) {
        window.filter.init(links);
      }
    };

    initCatalog();

  };

  window.catalog = {
    init: init
  };

})();
