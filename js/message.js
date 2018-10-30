'use strict';

(function () {

  var init = function (messageLink, messageTitle, previousObject) {

    var showMessage = function () {
      setMessageInteractivity();
      window.dom.removeClassName(messageLink, 'modal--hidden');
      if (button) {
        window.dom.setFocusOnObject(button);
        button.tabIndex = window.general.getIncreasedTabIndex();
      }
    };

    var hideMessage = function () {
      removeMessageInteractivity();
      window.dom.addClassName(messageLink, 'modal--hidden');
      if (button) {
        window.dom.setFocusOnObject(button);
        button.tabIndex = window.general.getDefaultTabIndex();
      }
      window.dom.setFocusOnObject(previousObject);
    };

    var onDocumentKeyDown = function (evt) {
      window.general.isEscEvent(evt, hideMessage);
    };

    var onDocumentClick = function (evt) {
      if (!messageLink.children[0].contains(evt.target)) {
        window.general.isEvent(evt, hideMessage);
      }
    };

    var onSingleButtonTabKeyDown = function (evt) {
      window.general.isPreventableTabEvent(evt);
    };

    var onButtonClick = function (evt) {
      window.general.isEvent(evt, hideMessage);
    };

    var switchMessageInteractivity = function (action) {
      document[action]('keydown', onDocumentKeyDown);
      document[action]('click', onDocumentClick);
      if (button) {
        button[action]('click', onButtonClick);
        button[action]('keydown', onSingleButtonTabKeyDown);
      }
    };

    var setMessageInteractivity = function () {
      switchMessageInteractivity('addEventListener');
    };

    var removeMessageInteractivity = function () {
      switchMessageInteractivity('removeEventListener');
    };

    var setMessageTitle = function (text) {
      var messageText = window.dom.getElementBySelector(messageLink, 'p');
      if (messageText) {
        messageText.textContent = text;
      }
    };


    var button = messageLink.querySelector('button');
    if (messageTitle) {
      setMessageTitle(messageTitle);
    }
    showMessage();

  };

  window.message = {
    init: init
  };
})();
