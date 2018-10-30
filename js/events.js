'use strict';

(function () {
  window.candyevents = {
    /*События перемещения карточек между корзиной и каталогом: catalog-basket*/
    ADD_TO_BASKET: 'ADD_TO_BASKET',
    ADD_FROM_BASKET: 'ADD_FROM_BASKET',
    REQUEST_TO_BASKET: 'REQUEST_TO_BASKET',
    /*Запрос данных каталога для подсчета количества карточек по типам фильтра: filter-catalog*/
    REQUEST_FILTER_CATALOG: 'REQUEST_FILTER_CATALOG',
    ANSWER_CATALOG_FILTER: 'ANSWER_CATALOG__FILTER',
    /*Переключение состояния полей заказа в зависимости от состояния: main-order-basket*/
    SWITCH_ORDER_STATE: 'SWITCH_ORDER_STATE',
    /*инициализация фильтра, слайдера + передача макс.значения после загрузки данных: slider-filter-catalog*/
    FILTER_INIT: 'FILTER_INIT',
    /**/
    CHANGE_SORT: 'CHANGE_SORT',
    CHANGE_FILTER: 'CHANGE_FILTER',
    CHANGE_FILTER_PRODUCT: 'CHANGE_FILTER_PRODUCT',
    CHANGE_FILTER_PROPERTY: 'CHANGE_FILTER_PROPERTY',
    CHANGE_FILTER_PRICE: 'CHANGE_FILTER_PRICE',
    CHANGE_FILTER_MARK: 'CHANGE_FILTER_MARK'
  };
})();
