'use strict';

(function () {

  var constants = window.constants;
  var bus = window.mediator.bus;
  var events = window.candyevents;

  var strongFilters = {};
  if (constants) {
    window.common.getArrayFromObject(constants.FILTER_TYPES).forEach(function (item) {
      if (item.strong) {
        strongFilters[item.name] = true;
      }
    });
  }

  var setFilterAmountByCard = function (descriptions, descriptionItem, card) {
    var description = descriptions[descriptionItem];
    switch (description.filterType) {
      case constants.FILTER_TYPES.foodType.name:
        description.amount += (description.name === card.kind) ? 1 : 0;
        break;
      case constants.FILTER_TYPES.foodProperty.name:
        var propertyName = descriptionItem.replace(constants.INVERT_PROPERTY_SUFFIX, '');
        description.amount += +((propertyName === descriptionItem) ? card.nutritionFacts[propertyName] : !card.nutritionFacts[propertyName]);
        break;
      case constants.FILTER_TYPES.mark.name:
        if (descriptionItem === constants.FILTER_SUBTYPES.availability) {
          description.amount += +(card.amount > 0);
        } else if (descriptionItem === constants.FILTER_SUBTYPES.favorite) {
          description.amount += +(card.selected > 0);
        }
        break;
      case constants.FILTER_TYPES.price.name:
        description.amount += +(card.price > 0);
        break;
      case constants.SORT_NAME:
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
        filter.state.price.max = Math.ceil(Math.max(data.firstValue, data.secondValue) * filter.priceUpperBound / 100);
        links.rangePriceMin.textContent = filter.state.price.min;
        links.rangePriceMax.textContent = filter.state.price.max;
        filter.allUnset = getAllUnsetStatus();
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

    var unsetContradictoryFilter = function (filterTypes) {
      filterTypes.forEach(function (type) {
        filter.state[type] = [];
        Object.keys(filter.description).map(function (key) {
          return key;
        }).forEach(function (item) {
          if (filter.description[item].filterType === type) {
            filter.description[item].basicDom.checked = false;
          }
        });
      });
    };

    var setThisFilter = function (filterType, filterValue) {
      filter.state[filterType].push(filterValue);
    };

    var unsetThisFilter = function (filterType, filterValue) {
      filter.state[filterType] = filter.state[filterType].filter(function (item) {
        return item !== filterValue;
      });
    };

    var getBasicUnsetStatus = function () {
      return (filter.state[constants.FILTER_TYPES.foodType.name].length === 0) &&
      (filter.state[constants.FILTER_TYPES.foodProperty.name].length === 0) &&
      (filter.state[constants.FILTER_TYPES.mark.name].length === 0);
    };

    var getPriceUnsetStatus = function () {
      return (filter.state[constants.FILTER_TYPES.price.name].max === filter.upperBound) &&
      (filter.state[constants.FILTER_TYPES.price.name].min === 0);
    };

    var getAllUnsetStatus = function () {
      return getPriceUnsetStatus() && getBasicUnsetStatus();
    };

    var getDefaultFilterState = function (upperBound) {
      var temporaryObject = {};
      temporaryObject[constants.FILTER_TYPES.foodType.name] = [];
      temporaryObject[constants.FILTER_TYPES.foodProperty.name] = [];
      temporaryObject[constants.FILTER_TYPES.mark.name] = [];
      temporaryObject[constants.FILTER_TYPES.price.name] = {min: 0, max: upperBound};
      return temporaryObject;
    };

    var getDefaultSortState = function () {
      return constants.DEFAULT_SORT_STATE;
    };

    var resetAllFilter = function () {
      filter.sort = getDefaultSortState();
      filter.state = getDefaultFilterState(filter.priceUpperBound);
      setPriceFilter(filter.state.price.min, filter.state.price.max);
      bus.emitEvent(events.SLIDER_RESET);
      window.common.getArrayFromObject(filter.description).forEach(function (item) {
        item.basicDom.checked = false;
      });
      filter.description[filter.sort].basicDom.checked = true;
    };

    var restoreCurrent = function (filterType, filterValue, filterChecked) {
      if (filterType === constants.FILTER_TYPES.mark.name && filterChecked) {
        filter.description[filterValue].basicDom.checked = filterChecked;
        setThisFilter(filterType, filterValue);
      }
    };

    var onSortStateChange = window.common.debounce(function (sortValue) {
      filter.sort = sortValue;
      bus.emitEvent(events.CHANGE_SORT, filter);
    });

    var onFilterStateChange = window.common.debounce(function (filterType, filterValue, filterChecked) {
      /*  Если значение strong для типа фильтра === Истина - нужно сбросить текущее состояние всех фильтров */
      /*  Но дополнительно если это фильтр типа mark, переключенный в checked === true - нужно восстановить его состояние после сброса. Во набредила-то... */
      if (strongFilters[filterType]) {
        resetAllFilter();
        restoreCurrent(filterType, filterValue, filterChecked);
      }
      if (filterType !== constants.FILTER_TYPES.all.name) {
        if (filterChecked) {
          setThisFilter(filterType, filterValue);
          unsetContradictoryFilter((filterType === constants.FILTER_TYPES.mark.name) ? [constants.FILTER_TYPES.foodType.name, constants.FILTER_TYPES.foodProperty.name] : [constants.FILTER_TYPES.mark.name]);
        } else {
          unsetThisFilter(filterType, filterValue);
        }
      }
      filter.allUnset = getAllUnsetStatus();
      bus.emitEvent(events.CHANGE_FILTER, filter);
    });

    var onFormChange = function (evt) {
      var element = evt.target;
      if (element.tagName === 'INPUT') {
        if (filter.description[element.value]) {
          if (element.name === constants.SORT_NAME) {
            onSortStateChange(element.value);
          } else {
            onFilterStateChange(element.name, element.value, element.checked);
          }
        }
      }
    };

    var checkMarkState = function (markName) {
      if (filter.description[markName].basicDom.checked) {
        bus.emitEvent(events.CHANGE_FILTER, filter);
      }
    };

    var onCheckFavorite = function () {
      checkMarkState(constants.FILTER_SUBTYPES.favorite);
    };

    var onCheckAvailability = function () {
      checkMarkState(constants.FILTER_SUBTYPES.availability);
    };

    var onFormSubmit = function (evt) {
      evt.preventDefault();
      onFilterStateChange(constants.FILTER_TYPES.all.name, constants.FILTER_TYPES.all.name, true);
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
          if (element.type.toUpperCase() !== 'RADIO') {
            label.nextElementSibling.textContent = '(' + temporaryObject[element.value.toString()].amount + ')';
          }
        });
      }
      if (links.formFilterPTag) {
        var label = links.formFilterPTag.children[0];
        temporaryObject[constants.FILTER_TYPES.price.name] = {name: 'Цена', amount: 0, filterType: constants.FILTER_TYPES.price.name,
          contentDom: label, basicDom: links.formFilterPTag, keyProperty: constants.FILTER_TYPES.price.name
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
      state: getDefaultFilterState(constants.DEFAULT_UPPER_BOUND),
      sort: constants.DEFAULT_SORT_STATE,
      priceUpperBound: constants.DEFAULT_UPPER_BOUND,
      allUnset: true
    };

    bus.addEvent(events.CHANGE_PRICE, onSliderChange);
    bus.addEvent(events.FILTER_INIT, onInitFilter);
    bus.addEvent(events.ANSWER_CATALOG_FILTER, onAnswerFromCatalog);
    bus.addEvent(events.REQUEST_STATE_FAVORITE, onCheckFavorite);
    bus.addEvent(events.REQUEST_STATE_AVAILABILITY, onCheckAvailability);
  };

  window.filter = {
    init: init
  };

})();
