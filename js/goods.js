'use strict';

(function () {
  var CATALOG_OBJECT_AMOUNT = 26;
  var GOODS = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие',
    'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Кaрманный портвейн',
    'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке',
    'Чернющий мистер чеснок', 'Нафиг. Ибо нефиг...', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет',
    'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное',
    'Острый язычок'];
  var COMPONENTS = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца',
    'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель',
    'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];
  var PICTURES = ['gum-cedar.jpg', 'gum-chile.jpg', 'gum-eggplant.jpg', 'gum-mustard.jpg', 'gum-portwine.jpg',
    'gum-wasabi.jpg', 'ice-cucumber.jpg', 'ice-eggplant.jpg', 'ice-garlic.jpg', 'ice-italian.jpg',
    'ice-mushroom.jpg', 'ice-pig.jpg', 'marmalade-beer.jpg', 'marmalade-caviar.jpg', 'marmalade-corn.jpg',
    'marmalade-new-year.jpg', 'marmalade-sour.jpg', 'marshmallow-bacon.jpg', 'marshmallow-beer.jpg',
    'marshmallow-shrimp.jpg', 'marshmallow-spicy.jpg', 'marshmallow-wine.jpg', 'soda-bacon.jpg',
    'soda-celery.jpg', 'soda-cob.jpg', 'soda-garlic.jpg', 'soda-peanut-grapes.jpg', 'soda-nafig-nefig.jpg'];
  var PICTURES_PATH = 'img/cards';

  var AMOUNT_MIN = 0;
  var AMOUNT_MAX = 20;

  var RATING_MIN = 1;
  var RATING_MAX = 5;
  var RATING_AMOUNT_MIN = 10;
  var RATING_AMOUNT_MAX = 900;

  var FACT_ENERGY_MIN = 70;
  var FACT_ENERGY_MAX = 500;

  var PRICE_MIN = 50;
  var PRICE_MAX = 1000;
  var WEIGHT_MIN = 50;
  var WEIGHT_MAX = 2000;

  var DELIVERY_CLASSES = {store: 'deliver__store', courier: 'deliver__courier'};
  var STAR_CLASSES = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three',
    'stars__rating--four', 'stars__rating--five'];
  var CARD_CLASSES = {stock: 'card--in-stock', little: 'card--little', soon: 'card--soon'};
  var CARD_CLASSES_UPPER_BORDER = 5;
  var CARD_CLASSES_LOW_BORDER = 0;
  var CHARACTERISTICS = ['Без сахара', 'Содержит сахар'];

  // var basketObjectAmount = 3;

  var CARD_ID = 'data-id';

  var shuffleArray = function (arr) {
    var array = arr.slice();
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  var getRandomFromRange = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  var getRandomFromArray = function (arr) {
    return arr[getRandomFromRange(1, arr.length) - 1];
  };

  var getRandomLimitedSetFromArray = function (arr, setLength) {
    var reSortedArray = shuffleArray(arr);
    reSortedArray.length = Math.min(setLength, reSortedArray.length);
    return reSortedArray;
  };

  var getToStringConvertedArray = function (arr, delimiter) {
    return (arr.length === 0) ? '' : arr.join(delimiter);
  };

  var getRandomComplexString = function (sourceArray, setLength) {
    return getToStringConvertedArray(getRandomLimitedSetFromArray(sourceArray, setLength), ', ');
  };

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

  var addClassNameBySelector = function (parentObj, selector, className) {
    var obj = parentObj.querySelector(selector);
    if (obj) {
      addClassName(obj, className);
    }
  };

  var replaceClassNameBySelector = function (parentObj, selector, className, classSet) {
    var obj = parentObj.querySelector(selector);
    if (obj) {
      removeAlternatives(obj, classSet);
      addClassName(obj, className);
    }
  };

  var removeAlternatives = function (obj, classSet) {
    if (Array.isArray(classSet)) {
      classSet.forEach(function (item) {
        removeClassName(obj, item);
      });
    } else {
      Object.keys(classSet).map(function (el) {
        return el;
      }).forEach(function (item) {
        removeClassName(obj, item);
      });
    }
  };

  var replaceClassNameByObj = function (obj, className, classSet) {
    removeAlternatives(obj, classSet);
    addClassName(obj, className);
  };

  var addClassName = function (obj, className) {
    if (!obj.classList.contains(className)) {
      obj.classList.add(className);
    }
  };

  var removeClassName = function (obj, className) {
    if (obj.classList.contains(className)) {
      obj.classList.remove(className);
    }
  };

  var getElementBySelector = function (parentElement, selector) {
    if (parentElement) {
      return parentElement.querySelector(selector);
    }
    return false;
  };

  var setAttributeBySelector = function (element, selector, attribute, value) {
    var el = element.querySelector(selector);
    if (el) {
      el[attribute] = value;
    }
  };

  var setAttributeBySelectorMulty = function (element, selector, attribute, value) {
    var attributes = Array.isArray(attribute) ? attribute : [attribute];
    var values = Array.isArray(value) ? value : [value];
    var selectors = Array.isArray(selector) ? selector : [selector];
    var arraysMinLength = Math.min(attributes.length, values.length, selectors.length);
    for (var i = 0; i < arraysMinLength; i++) {
      var el = element.querySelector(selector[i]);
      if (el) {
        el[attributes[i]] = values[i];
      }
    }
  };

  var changeFirstNumericDataWithoutOwnTag = function (element, selector, value) {
    var block = element.querySelector(selector);
    if (block) {
      block.innerHTML = block.innerHTML.replace(/\d*\s/, parseInt('' + value, 10));
    }
  };

  var getTemplateContent = function (templateSelector, contentSelector) {
    var templateBySelector = document.querySelector(templateSelector);
    if (templateBySelector) {
      return templateBySelector.content.querySelector(contentSelector);
    }
    return false;
  };

  var generateObjectArray = function (objAmount) {
    var dataArray = [];
    var notRepeatedGoods = getRandomLimitedSetFromArray(GOODS, objAmount);
    var notRepeatedPictures = getRandomLimitedSetFromArray(PICTURES, objAmount);
    for (var i = 0; i < objAmount; i++) {
      dataArray[i] = {};
      dataArray[i]['name'] = (i < notRepeatedGoods.length) ? notRepeatedGoods[i] : getRandomFromArray(GOODS);
      dataArray[i]['picture'] = PICTURES_PATH + '\\' + ((i < notRepeatedPictures.length) ? notRepeatedPictures[i] : getRandomFromArray(PICTURES));
      dataArray[i]['amount'] = getRandomFromRange(AMOUNT_MIN, AMOUNT_MAX);
      dataArray[i]['price'] = getRandomFromRange(PRICE_MIN, PRICE_MAX);
      dataArray[i]['weight'] = getRandomFromRange(WEIGHT_MIN, WEIGHT_MAX);
      dataArray[i]['rating'] = {
        value: getRandomFromRange(RATING_MIN, RATING_MAX),
        number: getRandomFromRange(RATING_AMOUNT_MIN, RATING_AMOUNT_MAX)};
      dataArray[i]['nutritionFacts'] = {
        sugar: !getRandomFromRange(0, 1),
        energy: getRandomFromRange(FACT_ENERGY_MIN, FACT_ENERGY_MAX),
        content: getRandomComplexString(COMPONENTS, getRandomFromRange(1, COMPONENTS.length))};
      dataArray[i]['id'] = 'id-' + i;
    }
    return dataArray;
  };

  var createCatalogElement = function (template, data) {
    var element = template.cloneNode(true);
    var header = element.querySelector('.card__header');
    var btnWrapper = element.querySelector('.card__btns-wrap');
    setAttributeBySelectorMulty(header, ['.card__title', 'img', 'img'], ['textContent', 'src', 'alt'],
        [data.name, data.picture, data.name]);
    changeFirstNumericDataWithoutOwnTag(element, '.card__price', data.price);
    setAttributeBySelector(element, '.card__weight', 'textContent', data.weight);
    setAttributeBySelector(element, '.star__count', 'textContent', data.rating.number);
    setAttributeBySelector(element, '.card__characteristic', 'textContent', getCharacteristicText(data.nutritionFacts.sugar));
    setAttributeBySelector(element, '.card__composition-list', 'textContent', data.nutritionFacts.content);
    replaceClassNameByObj(element, getClassNameByAmount(data.amount), CARD_CLASSES);
    replaceClassNameBySelector(element, '.stars__rating', getClassNameByRating(data.rating.value), STAR_CLASSES);
    element.setAttribute(CARD_ID, data.id);
    btnWrapper.setAttribute(CARD_ID, data.id);
    return element;
  };

  var renderCatalog = function (dataArray) {
    var template = catalogElementContainer;
    var insertionPoint = catalogContainer;
    if (template && insertionPoint) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < dataArray.length; i++) {
        fragment.appendChild(createCatalogElement(template, dataArray[i]));
      }
      insertionPoint.appendChild(fragment);
    }
    removeClassName(insertionPoint, '.catalog__cards--load');
    addClassNameBySelector(insertionPoint, '.catalog__load', 'visually-hidden');
  };

  var createBasketElement = function (template, data) {
    var element = template.cloneNode(true);
    var orderHeader = element.querySelector('.card-order__header');
    setAttributeBySelectorMulty(orderHeader, ['.card-order__title', 'img', 'img'], ['textContent', 'src', 'alt'],
        [data.name, data.picture, data.name]);
    changeFirstNumericDataWithoutOwnTag(element, '.card-order__price', data.price);
    setAttributeBySelector(element, '.card-order__count', 'value', data.amount);
    element.setAttribute(CARD_ID, data.id);
    return element;
  };

  var renderBasket = function (dataArray) {
    var template = basketElementTemplate;
    var insertionPoint = basketContainer;
    if (template && insertionPoint) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < dataArray.length; i++) {
        fragment.appendChild(createBasketElement(template, dataArray[i]));
      }
      insertionPoint.appendChild(fragment);
    }
    removeClassName(insertionPoint, '.goods__cards--empty');
    addClassNameBySelector(insertionPoint, '.goods__card-empty', 'visually-hidden');
  };

  var onCatalogClick = function (evt) {
    var el = evt.target;
    if (el.tagName !== 'A') {
      return false;
    }
    evt.preventDefault();
    while (el !== catalogContainer) {
      if (el.classList.contains('card__btn-favorite') && el.parentElement.hasAttribute(CARD_ID)) {
        el.classList.toggle('card__btn-favorite--selected');
        return false;
      }
      if (el.classList.contains('card__btn') && el.parentElement.hasAttribute(CARD_ID)) {
        putCardToBasket(el.parentElement.getAttribute(CARD_ID));
        return false;
      }
      el = el.parentNode;
    }
    return false;
  };

  var getTextForm = function (numSource, textForms) {
    numSource = Math.abs(numSource) % 100;
    var numTmp = numSource % 10;
    if (numSource > 10 && numSource < 20) {
      return textForms[2];
    }
    if (numTmp > 1 && numTmp < 5) {
      return textForms[1];
    }
    if (numTmp === 1) {
      return textForms[0];
    }
    return textForms[2];
  };

  var getMainBasketHeaderText = function (arr) {
    var totalAmount = arr.reduce(function (sum, current) {
      return sum + current.amount;
    }, 0);
    return (totalAmount === 0) ? 'В корзине ничего нет' : 'В корзине ' + totalAmount + ' ' + getTextForm(totalAmount, ['товар', 'товара', ' товаров']);
  };

  var getIndexByID = function (arr, ind) {
    return arr.indexOf(arr.filter(function (item) {
      return item.id === ind;
    })[0]);
  };

  var checkSourceAmount = function (source, ind) {
    if ((source.amount <= CARD_CLASSES_LOW_BORDER) || (source.amount === CARD_CLASSES_UPPER_BORDER)) {
      var element = getElementBySelector(catalogContainer, '.catalog__card[data-id="' + ind + '"]');
      replaceClassNameByObj(element, getClassNameByAmount(source.amount), CARD_CLASSES);
    }
  };

  var putCardToBasket = function (ind) {
    var target = {};
    var sourceIndex = getIndexByID(catalogCards, ind);
    var targetIndex = getIndexByID(basketCards, ind);
    if (sourceIndex >= 0) {
      var source = catalogCards[sourceIndex];
      if (source.amount > 0) {
        if (targetIndex >= 0) {
          target = basketCards[targetIndex];
          target.amount = (target.amount) ? (target.amount + 1) : 1;
          var itemSelector = '.goods_card[data-id="' + ind + '"] .card-order__count';
          setAttributeBySelector(basketContainer, itemSelector, 'value', target.amount);
        } else {
          target = Object.assign({}, source);
          target.amount = 1;
          basketCards.push(target);
          renderBasket([target]);
        }
        basketMainHeader.textContent = getMainBasketHeaderText(basketCards);
        source.amount = source.amount - 1;
        checkSourceAmount(source, ind);
      }
    }
  };

  var deliverySwitchTo = function (className) {
    Object.keys(DELIVERY_CLASSES).map(function (el) {
      return el;
    }).forEach(function (item) {
      var element = getElementBySelector(deliverContainer, '.' + DELIVERY_CLASSES[item]);
      if (element && element.classList.contains(className)) {
        removeClassName(element, 'visually-hidden');
      }
      if (element && !element.classList.contains(className)) {
        addClassName(element, 'visually-hidden');
      }
    });
  };

  var onDeliverButtonsClick = function (evt) {
    var el = evt.target;
    if ((el.tagName !== 'INPUT')) {
      return false;
    }
    if (el.name === 'method-deliver' && el.hasAttribute('id')) {
      deliverySwitchTo(el.getAttribute('id'));
    }
    return false;
  };

  var initCatalog = function () {
    renderCatalog(catalogCards);
    renderBasket(basketCards);
    if (catalogContainer) {
      catalogContainer.addEventListener('click', onCatalogClick);
    }
    if (deliverButtons) {
      deliverButtons.addEventListener('click', onDeliverButtonsClick);
    }
  };

  var basketContainer = document.querySelector('.goods__cards');
  var basketElementTemplate = getTemplateContent('#card-order', '.goods_card');
  var basketMainHeader = document.querySelector('.main-header__basket');

  var catalogContainer = document.querySelector('.catalog__cards');
  var catalogElementContainer = getTemplateContent('#card', '.catalog__card');

  var deliverContainer = document.querySelector('.deliver');
  var deliverButtons = getElementBySelector(deliverContainer, '.deliver__toggle');

  var catalogCards = generateObjectArray(CATALOG_OBJECT_AMOUNT);
  var basketCards = [];

  initCatalog();

})();


