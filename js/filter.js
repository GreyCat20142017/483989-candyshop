'use strict';

(function () {
  var filterDescription = {};
  var filterNameToValue = {};
  var maxValue = 0;
  var FILTERS = ['food-type', 'food-property', 'mark'];

  var bus = window.mediator.bus;
  var events = window.candyevents;

  var getFilterPositionByType = function (currentFilter, type) {
    return window.common.getKeysArrayFromObject(currentFilter).filter(function (item) {
      return (currentFilter[item].filterType === type);
    });
  };

  var setFilterAmountByCard = function (descriptions, descriptionItem, card) {
    var description = descriptions[descriptionItem];
    switch (description.filterType) {
      case 'food-type':
        description.amount += (description.name === card.kind) ? 1 : 0;
        break;
      case 'food-property':
        var propertyName = descriptionItem.replace('-free', '');
        description.amount += +((propertyName === descriptionItem) ? card.nutritionFacts[propertyName] : !card.nutritionFacts[propertyName]);
        break;
      case 'mark':
        if (descriptionItem === 'availability') {
          description.amount += +(card.amount > 0);
        } else if (descriptionItem === 'favorite') {
          description.amount += +(card.selected > 0);
        }
        break;
      case 'price':
        description.amount += +(card.price > 0);
        break;
      case 'sort':
        break;
      default:
        break;
    }
  };

  var fillAmountByCategory = function (cards, descriptions) {
    cards.forEach(function (card) {
      window.common.getKeysArrayFromObject(descriptions).forEach(function (descriptionItem) {
        setFilterAmountByCard(descriptions, descriptionItem, card);
      });
      maxValue = (card.price >= maxValue) ? card.price : maxValue;
    });
    window.common.getKeysArrayFromObject(descriptions).forEach(function (item) {
      var element = descriptions[item].contentDom;
      if (element) {
        element.textContent = '(' + descriptions[item].amount + ')';
      }
    });
    return descriptions;
  };


  var init = function (links, catalogCards, callback) {

    var onSliderChange = function (data) {
      if (links.rangePriceMin && links.rangePriceMax) {
        links.rangePriceMin.textContent = Math.floor(Math.min(data.firstValue, data.secondValue));
        links.rangePriceMax.textContent = Math.floor(Math.max(data.firstValue, data.secondValue));
      }
    };

    var prepareFilter = function () {
      bus.addEvent(events.CHANGE_PRICE, onSliderChange);
      fillAmountByCategory(catalogCards, filterDescription);
      setFilterInteractivity();
    };

    var switchFilterInteractivity = function (action) {
      if (links.formFilter) {
        links.formFilter[action]('change', onFormChange);
      }
    };

    var setFilterInteractivity = function () {
      switchFilterInteractivity('addEventListener');
    };


    var onFormChange = function (evt) {
      var element = evt.target;
      if (element.tagName === 'INPUT') {
        if (FILTERS.indexOf(element.name) >= 0) {
          callback(element.name, element.value, element.checked);
        }
      }
    };

    var createMapNameToValue = function () {
      var temporaryObject = {};
      window.common.getKeysArrayFromObject(filterDescription).forEach(function (item) {
        temporaryObject[filterDescription[item].name] = item;
      });
      return temporaryObject;
    };

    var generateFilterDescription = function () {
      var temporaryObject = {};
      if (links.formFilterInputs) {
        Array.prototype.slice.call(links.formFilterInputs).forEach(function (element) {
          var label = element.nextElementSibling;
          temporaryObject[element.value.toString()] = {name: label.textContent, amount: 0, filterType: element.name, state: element.checked,
            contentDom: label.nextElementSibling, basicDom: element, keyProperty: element.value.toString()
          };
          if (element.type.toLowerCase() !== 'radio') {
            label.nextElementSibling.textContent = '(' + temporaryObject[element.value.toString()].amount + ')';
          }
        });
      }
      if (links.formFilterPTag) {
        var label = links.formFilterPTag.children[0];
        temporaryObject['price'] = {name: 'Цена', amount: 0, filterType: 'price', state: false,
          contentDom: label, basicDom: links.formFilterPTag, keyProperty: 'price'
        };
      }
      return temporaryObject;
    };


    filterDescription = generateFilterDescription();
    filterNameToValue = createMapNameToValue();

    prepareFilter();

  };

  window.filter = {
    init: init,
    getDescription: function () {
      return filterDescription;
    },
    getNameToValue: function () {
      return filterNameToValue;
    },
    getMaxValue: function () {
      return maxValue;
    },
    fillAmountByCategory: fillAmountByCategory
  };

})();
