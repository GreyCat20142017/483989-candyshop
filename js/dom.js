'use strict';

(function () {

  var removeAlternatives = function (obj, classSet) {
    if (Array.isArray(classSet)) {
      classSet.forEach(function (item) {
        window.general.removeClassName(obj, item);
      });
    } else {
      Object.keys(classSet).map(function (el) {
        return el;
      }).forEach(function (item) {
        window.general.removeClassName(obj, classSet[item]);
      });
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
        window.general.addClassName(descendantElement, className);
      }
    },

    removeClassNameBySelector: function (parentElement, selector, className) {
      var descendantElement = parentElement.querySelector(selector);
      if (descendantElement) {
        window.general.removeClassName(descendantElement, className);
      }
    },

    replaceClassNameByObject: function (obj, className, classSet) {
      if (obj) {
        removeAlternatives(obj, classSet);
        window.general.addClassName(obj, className);
      }
    },

    replaceClassNameBySelector: function (parentObj, selector, className, classSet) {
      var obj = parentObj.querySelector(selector);
      if (obj) {
        removeAlternatives(obj, classSet);
        window.general.addClassName(obj, className);
      }
    },

    getElementBySelector: function (parentElement, selector) {
      if (parentElement) {
        return parentElement.querySelector(selector);
      }
      return false;
    }

  };
})();
