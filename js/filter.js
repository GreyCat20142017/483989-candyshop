'use strict';

(function () {

  var FILTER_TYPES = {'food-type': false, 'food-property': false, 'mark': true, 'all': true};
  /* var SORT_TYPES = {'popular': true,'expensive': true, 'cheep': true, 'rating': true}; */
  var DEFAULT_SORT_STATE = 'popular';

  var bus = window.mediator.bus;
  var events = window.candyevents;

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
    });
    window.common.getKeysArrayFromObject(descriptions).forEach(function (item) {
      var element = descriptions[item].contentDom;
      if (element) {
        element.textContent = '(' + descriptions[item].amount + ')';
      }
    });
    return descriptions;
  };

  var init = function (links) {

    var onSliderChange = function (data) {
      if (links.rangePriceMin && links.rangePriceMax) {
        filter.state.price.min = Math.floor(Math.min(data.firstValue, data.secondValue) * filter.priceUpperBound / 100);
        filter.state.price.max = Math.floor(Math.max(data.firstValue, data.secondValue) * filter.priceUpperBound / 100);
        links.rangePriceMin.textContent = filter.state.price.min;
        links.rangePriceMax.textContent = filter.state.price.max;
        bus.emitEvent(events.CHANGE_FILTER, filter);
      }
    };

    var switchFilterInteractivity = function (action) {
      if (links.formFilter) {
        links.formFilter[action]('change', onFormChange);
        links.formFilter[action]('submit', onFormSubmit);
      }
    };

    var setFilterInteractivity = function () {
      switchFilterInteractivity('addEventListener');
    };

    var setThisFilter = function (filterType, filterValue) {
      filter.state[filterType].push(filterValue);
    };

    var unsetThisFilter = function (filterType, filterValue) {
      filter.state[filterType] = filter.state[filterType].filter(function (item) {
        return item !== filterValue;
      });
    };

    var onSortStateChange = function (sortValue) {
      filter.sort = sortValue;
      bus.emitEvent(events.CHANGE_SORT, filter);
    };

    var onFilterStateChange = function (filterType, filterValue, filterChecked) {
      /*  Если по типу фильтра в массиве сответствующее значение Истина - нужно сбросить текущее состояние всех фильтров */
      if (FILTER_TYPES[filterType]) {
        resetAllFilter();
      }
      if (filterType !== 'all') {
        if (filterChecked) {
          setThisFilter(filterType, filterValue);
        } else {
          unsetThisFilter(filterType, filterValue);
        }
      }
      bus.emitEvent(events.CHANGE_FILTER, filter);
    };

    var getDefaultFilterState = function () {
      return {'food-type': [], 'food-property': [], 'mark': [], 'price': {min: 0, max: 100}};
    };

    var getDefaultSortState = function () {
      return DEFAULT_SORT_STATE;
    };

    var resetAllFilter = function () {
      filter.sort = getDefaultSortState();
      filter.state = getDefaultFilterState();
      filter.state.price.max = filter.priceUpperBound;
      setPriceFilter(filter.state.price.min, filter.state.price.max);
      bus.emitEvent(events.SLIDER_RESET);
      window.common.getArrayFromObject(filter.description).forEach(function (item) {
        item.basicDom.checked = false;
      });
      filter.description[filter.sort].basicDom.checked = true;
    };

    var onFormChange = function (evt) {
      var element = evt.target;
      if (element.tagName === 'INPUT') {
        if (filter.description[element.value]) {
          if (element.name === 'sort') {
            onSortStateChange(element.value);
          } else {
            onFilterStateChange(element.name, element.value, element.checked);
          }
        }
      }
    };

    var onFormSubmit = function (evt) {
      evt.preventDefault();
      onFilterStateChange('all', 'all', true);
    };

    var setPriceFilter = function (min, max) {
      if (links.rangePriceMin && links.rangePriceMax) {
        links.rangePriceMin.textContent = min;
        links.rangePriceMax.textContent = max;
      }
      filter.state.price.min = min;
      filter.state.price.max = max;
    };

    var generateFilterDescription = function () {
      var temporaryObject = {};
      if (links.formFilterInputs) {
        Array.prototype.slice.call(links.formFilterInputs).forEach(function (element) {
          var label = element.nextElementSibling;
          temporaryObject[element.value.toString()] = {name: label.textContent, amount: 0, filterType: element.name,
            contentDom: label.nextElementSibling, basicDom: element, keyProperty: element.value.toString()
          };
          if (element.type.toLowerCase() !== 'radio') {
            label.nextElementSibling.textContent = '(' + temporaryObject[element.value.toString()].amount + ')';
          }
        });
      }
      if (links.formFilterPTag) {
        var label = links.formFilterPTag.children[0];
        temporaryObject['price'] = {name: 'Цена', amount: 0, filterType: 'price',
          contentDom: label, basicDom: links.formFilterPTag, keyProperty: 'price'
        };
      }
      return temporaryObject;
    };

    var onAnswerFromCatalog = function (cards) {
      fillAmountByCategory(cards, filter.description);
    };

    var onInitFilter = function (data) {
      filter.state.price.min = data.min;
      filter.state.price.max = data.max;
      filter.priceUpperBound = data.max;
      setPriceFilter(filter.state.price.min, filter.state.price.max);
      bus.emitEvent(events.SLIDER_RESET);
      bus.emitEvent(events.REQUEST_FILTER_CATALOG);
      bus.removeEvent(events.FILTER_INIT, onInitFilter);
      setFilterInteractivity();
    };

    var filter = {
      description: generateFilterDescription(),
      state: {'food-type': [], 'food-property': [], 'mark': [], 'price': {min: 0, max: 100}, 'all': true},
      sort: 'popular',
      priceUpperBound: 100
    };

    bus.addEvent(events.CHANGE_PRICE, onSliderChange);
    bus.addEvent(events.FILTER_INIT, onInitFilter);
    bus.addEvent(events.ANSWER_CATALOG_FILTER, onAnswerFromCatalog);
  };

  window.filter = {
    init: init
  };

})();
