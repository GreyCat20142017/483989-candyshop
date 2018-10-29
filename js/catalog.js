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

  var init = function (links, catalogCards) {

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

    var createCatalogCard = function (template, data) {
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

    var renderCatalogByFilter = function (filterName, filterValue, filterState) {
      setFilterState(filterName, filterValue, filterState);
      var checkedFilters = getCheckedFilters();
      if (checkedFilters.length === 0) {
        renderCatalog(catalogCards, links.catalogCardTemplate, links.catalogContainer);
      } else {
        var filteredCatalogCards = catalogCards.filter(function(card) {
          return getMatchResult(card, checkedFilters);
        });
        if (filteredCatalogCards.length === 0) {
          renderMessage(links.emptyFiltersTemplate, links.catalogContainer);
        } else {
          renderCatalog(filteredCatalogCards, links.catalogCardTemplate, links.catalogContainer);
        }
      };
    };

    var renderCatalogMessage = function (template, insertionPoint) {
      if (template && insertionPoint) {
        insertionPoint.innerHTML = '';
        insertionPoint.appendChild(template);
      }
      window.dom.removeClassName(insertionPoint, '.catalog__cards--load');
      window.dom.addClassNameBySelector(insertionPoint, '.catalog__load', 'visually-hidden');
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
          switchCardSelected(element.parentElement.getAttribute(CARD_ID));
          return false;
        }
        if (element.classList.contains('card__btn') && element.parentElement.hasAttribute(CARD_ID)) {
          addUnitToBasket(element.parentElement.getAttribute(CARD_ID));
          return false;
        }
        if (element.classList.contains('card__btn-composition') && element.parentElement.hasAttribute(CARD_ID)) {
          showComposition(element.parentElement.getAttribute(CARD_ID));
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
      var catalogIndex = window.common.getIndexByID(catalogCards, cardID);
      catalogCards[catalogIndex].selected = !(catalogCards[catalogIndex].selected);
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


    var initCatalog = function () {

      // bus.addEvent(events.RETURN_CARD, onSliderChange);
      if (links.catalogContainer) {
        links.catalogContainer.addEventListener('click', onCatalogClick);
      }

      if (window.backend) {
        window.backend.getData(onGetData, onGetDataError);
      }
      if (window.slider) {
        window.slider.init(links);
      }
      if (window.filter) {
        window.filter.init(links, catalogCards);
      }
    };

    var unsetContradictoryFilter = function (filterTypes) {
      filterTypes.forEach(function(filterType) {
        currentFilterByCategories[filterType] = [];
        Object.keys(currentFilter).map(function (key) {
          return key;
        }).forEach(function(item) {
          if (currentFilter[item].filterType === filterType) {
            currentFilter[item].state = false;
            currentFilter[item].basicDom.checked = false;
          }
        });
      });
    };

    var setThisFilter = function (filterType, filterValue) {
      currentFilterByCategories[filterType].push(filterValue);
    };

    var unsetThisFilter = function (filterType, filterValue) {
      currentFilterByCategories[filterType] = currentFilterByCategories[filterType].filter(function (item) {
        return item !== filterValue;
      });
    };

    var setFilterState = function (filterName, filterValue, filterState) {
      var filterType = currentFilter[filterValue].filterType;
      currentFilter[filterValue].state = filterState;
      if (filterState) {
         unsetContradictoryFilter((filterType === 'mark')  ? ['food-type', 'food-property'] :  ['mark']);
         setThisFilter(filterType, filterValue);
      } else {
         unsetThisFilter(filterType, filterValue);
      };
    };

    var getCheckedFilters = function () {
      return Object.keys(currentFilter).map(function (key) {
        return currentFilter[key];
      }).filter(function (filterElement) {
        return filterElement.state && (filterElement.filterType !== 'sort');
      });
    };

    var isMatch = function (filterElement, card) {
      var matchResult = false;
      switch (filterElement.filterType) {
        case 'food-type':
          matchResult = (filterElement.name === card.kind);
          break;
        case 'food-property':
          var propertyName = filterElement.keyProperty.replace('-free', '');
          matchResult = ((propertyName == filterElement.keyProperty) ? card.nutritionFacts[propertyName] : !card.nutritionFacts[propertyName]);
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

    var getMatchResult = function (card, checkedFilters) {
     var result = {'food-type': false, 'food-property': false, 'mark': false};
     for (var i = 0; i < checkedFilters.length; i++) {
       result[checkedFilters[i].filterType] = result[checkedFilters[i].filterType] || isMatch(checkedFilters[i], card);
      };
      return (currentFilterByCategories['mark'].length === 0) ? ((result['food-type'] || currentFilterByCategories['food-type'].length === 0) &&
              (result['food-property'] || currentFilterByCategories['food-property'].length === 0)) : result['mark'];
    };

    var renderCatalogByFilter = function (filterName, filterValue, filterState) {
      setFilterState(filterName, filterValue, filterState);
      var checkedFilters = getCheckedFilters();
      if (checkedFilters.length === 0) {
        renderCatalog(catalogCards, links.catalogCardTemplate, links.catalogContainer);
      } else {
        var filteredCatalogCards = catalogCards.filter(function(card) {
          return getMatchResult(card, checkedFilters);
        });
        if (filteredCatalogCards.length === 0) {
          renderMessage(links.emptyFiltersTemplate, links.catalogContainer);
        } else {
          renderCatalog(filteredCatalogCards, links.catalogCardTemplate, links.catalogContainer);
        }
      };
    };

    var onGetData = function (response) {
      catalogCards = [];
      response.forEach(function (item, index) {
        item.id = 'id-' + index;
        item.selected = false;
        catalogCards.push(item);
      });
      renderCatalog(catalogCards, links.catalogCardTemplate, links.catalogContainer);
      if (window.filter) {
        currentFilter = window.filter.fillAmountByCategory(catalogCards, window.filter.getDescription());
        links.rangePriceMin.value = 0;
        links.rangePriceMax.value = window.filter.getMaxValue();
      }
    };

    var onGetDataError = function (errorMessage) {
      window.message.init(links.messages.errorMessage, errorMessage, document.activeElement);
    };


    var catalogCards = [];
    var basketCards = []; //temporary
    var currentFilter = {};
    var currentFilterByCategories = {'food-type': [], 'food-property': [], 'mark': [], 'price': {minPrice: 0, maxPrice: 0}};

    initCatalog();

  };

  window.catalog = {
    init: init
  }

})();


