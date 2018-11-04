'use strict';

(function () {
  window.candyevents = {
    /* Перемещение карточек между корзиной и каталогом: catalog-basket */
    ADD_TO_BASKET: 'ADD_TO_BASKET',
    ADD_FROM_BASKET: 'ADD_FROM_BASKET',
    REQUEST_TO_BASKET: 'REQUEST_TO_BASKET',
    /* Очистка корзины без возвращения в каталог по запросу модуля order (после успешного сабмита): basket-order*/
    RESET_BASKET: 'RESET_BASKET',
    /* Запрос данных каталога для подсчета количества карточек по типам фильтра: filter-catalog */
    REQUEST_FILTER_CATALOG: 'REQUEST_FILTER_CATALOG',
    ANSWER_CATALOG_FILTER: 'ANSWER_CATALOG__FILTER',
    /* Запрос состояния активности фильтровв mark в случае, если текущие карточки могут не совпасть с активным фильтром: catalog-filter */
    REQUEST_STATE_FAVORITE: 'REQUEST_STATE_FAVORITE',
    REQUEST_STATE_AVAILABILITY: 'REQUEST_STATE_AVAILABILITY',
    /* Переключение состояния полей заказа в зависимости от состояния: main-order-basket */
    SWITCH_ORDER_STATE: 'SWITCH_ORDER_STATE',
    /* инициализация фильтра, ресет слайдера + передача макс.значения после загрузки данных: slider-filter-catalog */
    FILTER_INIT: 'FILTER_INIT',
    SLIDER_RESET: 'SLIDER_RESET',
    /* Изменения фильтра и сортировки: filter-catalog*/
    CHANGE_SORT: 'CHANGE_SORT',
    CHANGE_FILTER: 'CHANGE_FILTER'
  };
})();
