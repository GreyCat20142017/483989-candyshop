'use strict';

(function () {
  window.constants = {
    FILTER_TYPES: {
      foodType: {name: 'food-type', strong: false},
      foodProperty: {name: 'food-property', strong: false},
      mark: {name: 'mark', strong: true},
      all: {name: 'all', strong: true},
      price: {name: 'price', strong: false}
    },
    FILTER_SUBTYPES: {availability: 'availability', favorite: 'favorite'},
    SORT_NAME: 'sort',
    DEFAULT_SORT_STATE: 'popular',
    SORT_TYPES: {popular: 'popular', expensive: 'expensive', cheap: 'cheep', rating: 'rating'},
    DEFAULT_UPPER_BOUND: 100,
    INVERT_PROPERTY_SUFFIX: '-free'};
})();
