'use strict';

(function () {

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
    var description = filter.description[descriptionItem];
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
    });
    window.common.getKeysArrayFromObject(descriptions).forEach(function (item) {
      var element = descriptions[item].contentDom;
      if (element) {
        element.textContent = '(' + descriptions[item].amount + ')';
      }
    });
    return descriptions
  };

  var init = function (links, catalogCards) {

    var onSliderChange = function (data) {
      if (links.rangePriceMin && links.rangePriceMax) {
        console.log()
        filter.state.price.min = Math.floor(Math.min(data.firstValue, data.secondValue) * filter.state.price.upperBound / 100) ;
        filter.state.price.max = Math.floor(Math.max(data.firstValue, data.secondValue) * filter.state.price.upperBound / 100);
        console.log('max '+filter.state.price.max+' '+ filter.state.price.upperBound  +' '+ Math.max(data.firstValue, data.secondValue))
        links.rangePriceMin.textContent = filter.state.price.min;
        links.rangePriceMax.textContent = filter.state.price.max;
      }
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
          bus.addEvent('FILTER_CHANGE', {filterName: element.name, filterValue: element.value, filterState: element.checked});
        }
      }
    };

    var createMapNameToValue = function () {
      var temporaryObject = {};
      window.common.getKeysArrayFromObject(filter.description).forEach(function (item) {
        temporaryObject[filter.description[item].name] = item;
      });
      return temporaryObject;
    };

    var setPriceFilter = function (min, max) {
      if (links.rangePriceMin && links.rangePriceMax) {
        links.rangePriceMin.textContent = min;
        links.rangePriceMax.textContent = max;
      };
      filter.state.price.min = min;
      filter.state.price.max = max;
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

    var onInitFilter = function (data) {
      filter.state.price.min = data.min;
      filter.state.price.max = data.max;
      filter.state.price.upperBound = data.upperBound;
      setPriceFilter(filter.state.price.min, filter.state.price.max);
      fillAmountByCategory(catalogCards, filter.description);
      setFilterInteractivity();
    };

    var filter = {
      state: {'food-type': [], 'food-property': [], 'mark': [], 'price': {min: 0, max: 100, upperBound: 100}, 'all': true},
      description: generateFilterDescription()
    };
    var filterNameToValue = createMapNameToValue();
    bus.addEvent(events.CHANGE_PRICE, onSliderChange);
    bus.addEvent(events.FILTER_INIT, onInitFilter);

  };

  window.filter = {
    getDescription: function () {
      return filter.description;
    },
    getNameToValue: function () {
      return filterNameToValue;
    },
    getMaxValue: function () {
      return maxValue;
    },
    getFilterState: function() {
      return filter.state;
    },

    init: init,
    fillAmountByCategory: fillAmountByCategory

  };

})();
