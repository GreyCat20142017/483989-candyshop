'use strict';

(function () {

  var removeAlternatives = function (obj, classSet) {
    if (Array.isArray(classSet)) {
      classSet.forEach(function (item) {
        removeClassName(obj, item);
      });
    } else {
      Object.keys(classSet).map(function (el) {
        return el;
      }).forEach(function (item) {
        removeClassName(obj, classSet[item]);
      });
    }
  };

  var removeClassName = function (element, className) {
    if (element && element.classList.contains(className)) {
      element.classList.remove(className);
    }
  };

  var addClassName = function (element, className) {
    if (element && !element.classList.contains(className)) {
      element.classList.add(className);
    }
  };

  var setFocusOnObject = function (interactiveObject) {
    if (interactiveObject) {
      interactiveObject.focus();
    }
  };

  window.dom = {
    getXCoordinate: function (element) {
      return element.getBoundingClientRect().x;
    },

    setAttributeBySelector: function (parentElement, selector, attribute, value) {
      var descendantElement = parentElement.querySelector(selector);
      if (descendantElement) {
        descendantElement[attribute] = value;
      }
    },

    getTemplateContent: function (templateSelector, contentSelector) {
      var templateBySelector = document.querySelector(templateSelector);
      if (templateBySelector) {
        return templateBySelector.content.querySelector(contentSelector);
      }
      return false;
    },

    removeChildren: function (parentElement) {
      while (parentElement.lastChild) {
        parentElement.removeChild(parentElement.lastChild);
      }
    },

    addClassNameBySelector: function (parentElement, selector, className) {
      var descendantElement = parentElement.querySelector(selector);
      if (descendantElement) {
        addClassName(descendantElement, className);
      }
    },

    removeClassNameBySelector: function (parentElement, selector, className) {
      var descendantElement = parentElement.querySelector(selector);
      if (descendantElement) {
        removeClassName(descendantElement, className);
      }
    },

    replaceClassNameByObject: function (obj, className, classSet) {
      if (obj) {
        removeAlternatives(obj, classSet);
        addClassName(obj, className);
      }
    },

    replaceClassNameBySelector: function (parentObj, selector, className, classSet) {
      var obj = parentObj.querySelector(selector);
      if (obj) {
        removeAlternatives(obj, classSet);
        addClassName(obj, className);
      }
    },

    getElementBySelector: function (parentElement, selector) {
      if (parentElement) {
        return parentElement.querySelector(selector);
      }
      return false;
    },

    changeFirstNumericDataWithoutOwnTag: function (element, selector, value) {
      var block = element.querySelector(selector);
      if (block) {
        block.innerHTML = block.innerHTML.replace(/\d*\s/, parseInt('' + value, 10));
      }
    },

    addClassName: addClassName,
    removeClassName: removeClassName,
    setFocusOnObject: setFocusOnObject

  };
})();
