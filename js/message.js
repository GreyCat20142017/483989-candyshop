'use strict';

(function () {
  var init = function (messageLink, messageTitle, hiddenButtons) {

    var show = function () {
      setMessageInteractivity();
      window.general.removeClassName(messageLink, 'visually-hidden');
    };

    var hide = function () {
      removeMessageInteractivity();
      window.general.addClassName(messageLink, 'visually-hidden');
    };

    var onButtonClick = function (evt) {
      window.events.isEvent(evt, hide);
    };

    var onDocumentKeyDown = function (evt) {
      window.events.isEscEvent(evt, hide);
    };

    var onDocumentClick = function (evt) {
      if (!messageLink.children[0].contains(evt.target)) {
        window.events.isEvent(evt, hide);
      }
    };

    var switchMessageInteractivity = function (action, additionalAction) {
      document[action]('keydown', onDocumentKeyDown);
      document[action]('click', onDocumentClick);
      if (messageLink) {
        Array.prototype.slice.call(buttons).forEach(function (button) {
          button[action]('click', onButtonClick);
          if (hiddenButtons) {
            window.general[additionalAction](button, 'visually-hidden');
          }
        });
      }
    };

    var setMessageInteractivity = function () {
      switchMessageInteractivity('addEventListener', 'addClassName');
    };

    var removeMessageInteractivity = function () {
      switchMessageInteractivity('removeEventListener', 'addClassName');
    };

    var setMessageTitle = function (text) {
      var messageText = window.dom.getElementBySelector(messageLink, 'h2');
      if (messageText) {
        messageText.textContent = text;
      }
    };

    var buttons = messageLink.querySelectorAll('button');
    if (messageTitle) {
      setMessageTitle(messageTitle);
    }
    show();
  };

  window.message = {
    init: init
  };
})();
