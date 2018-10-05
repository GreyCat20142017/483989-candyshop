'use strict';

(function () {
  var init = function (messageLink, messageTitle) {

    var show = function () {
      setMessageInteractivity();
      window.general.removeClassName(messageLink, 'modal--hidden');
    };

    var hide = function () {
      removeMessageInteractivity();
      window.general.addClassName(messageLink, 'modal--hidden');
    };

    var onDocumentKeyDown = function (evt) {
      window.events.isEscEvent(evt, hide);
    };

    var onDocumentClick = function (evt) {
      if (!messageLink.children[0].contains(evt.target)) {
        window.events.isEvent(evt, hide);
      }
    };

    var switchMessageInteractivity = function (action) {
      document[action]('keydown', onDocumentKeyDown);
      document[action]('click', onDocumentClick);
    };

    var setMessageInteractivity = function () {
      switchMessageInteractivity('addEventListener', 'addClassName');
    };

    var removeMessageInteractivity = function () {
      switchMessageInteractivity('removeEventListener', 'addClassName');
    };

    var setMessageTitle = function (text) {
      var messageText = window.dom.getElementBySelector(messageLink, 'p');
      if (messageText) {
        messageText.textContent = text;
      }
    };

    if (messageTitle) {
      setMessageTitle(messageTitle);
    }
    show();
  };

  window.message = {
    init: init
  };
})();
