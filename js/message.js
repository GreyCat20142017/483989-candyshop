'use strict';

(function () {

  var init = function (messageLink, messageTitle, previousObject, specific) {

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
        button.tabIndex = window.general.getDefaultTabIndex();
      }
      if (specific && messageLink) {
        specific.insertionPoint.removeChild(messageLink);
        specific.insertionPoint = null;
        messageLink = null;
      }
      window.dom.setFocusOnObject(previousObject);
    };

    var onDocumentClick = function (evt) {
      if (!previousObject.parentElement.contains(evt.target)) {
        window.general.isEvent(evt, hideMessage);
      }
    };

    var onDocumentKeyDown = function (evt) {
      window.general.isEscEvent(evt, hideMessage);
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

    var createSpecificMessage = function () {
      var createChild = function (tag, content) {
        var tmp = document.createElement(tag);
        tmp.textContent = content;
        return tmp;
      };

      if (specific && previousObject) {
        var div = document.createElement('div');
        var layoutStyle = specific.fixed ?  'position: fixed; top: 50%; left: 50%; margin-left: -240px; width: 480px;' :
         'position: absolute; top: 48px ; left: -10px; width: 268px;';
        div.style =
        layoutStyle + 'z-index: 5; font-size: 14px;  text-align: center; padding: 20px; background-color: rgb(255, 233, 111); ' +
        'background-image: radial-gradient(circle, rgba(255, 255, 255, 0.7) 10%, rgba(255, 255, 255, 0.5) 50%,  transparent 100%); ' +
        'box-shadow: 0 6px 15px 0 rgba(0, 1, 1, 0.45); border-radius: 6px;';
        div.classList.add('card__popup');
        div.appendChild(createChild('h2', specific.title));
        div.appendChild(createChild('p', specific.properties));
        div.appendChild(createChild('p', specific.composition));
        var btn = createChild('button', 'закрыть');
        btn.setAttribute('type', 'button');
        btn.classList.add('modal__close');
        div.appendChild(btn);
        return specific.insertionPoint.appendChild(div);
      }
      return false;
    };

    if (messageLink) {
      if (messageTitle) {
        setMessageTitle(messageTitle);
      }
    } else {
      messageLink = specific.insertionPoint.querySelector('.card__popup');
      if (!messageLink) {
        messageLink = createSpecificMessage();
      }
    }
    var button = messageLink.querySelector('button');
    showMessage();
  };

  window.message = {
    init: init
  };
})();
