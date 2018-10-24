'use strict';

(function () {
  var bus = window.mediator.bus;
  var events = window.candyevents;

  var init = function (links) {
    var getLimitedValue = function (newValue, leftLimit, rightLimit) {
      if (newValue < leftLimit) {
        return leftLimit;
      }
      if (newValue > rightLimit) {
        return rightLimit;
      }
      return newValue;
    };

    var onPinMouseDown = function (evt) {
      var refreshSliderState = function (moveUpEvt) {
        var newX = moveUpEvt.pageX - shiftX - sliderX;
        var rangeWidth = links.rangeFilter.offsetWidth;
        var rangeLeft = window.dom.getXCoordinate(links.rangeFilter);
        var sliderValue = getLimitedValue(newX, 0, rangeWidth) / rangeWidth * 100;

        currentPin.style.left = sliderValue + '%';
        var pinALeft = 100 * (window.dom.getXCoordinate(links.rangePinA) - rangeLeft) / rangeWidth;
        var pinBLeft = 100 * (window.dom.getXCoordinate(links.rangePinB) - rangeLeft) / rangeWidth;

        if (pinALeft > pinBLeft) {
          links.rangeLine.style.left = pinBLeft + '%';
          links.rangeLine.style.right = (100 - pinALeft) + '%';
        } else {
          links.rangeLine.style.left = pinALeft + '%';
          links.rangeLine.style.right = (100 - pinBLeft) + '%';
        }
        // if (links.rangePriceMin && links.rangePriceMax) {
        //   links.rangePriceMin.textContent = Math.floor(Math.min(pinALeft, pinBLeft));
        //   links.rangePriceMax.textContent = Math.floor(Math.max(pinALeft, pinBLeft));
        // }
        bus.emitEvent(events.CHANGE_PRICE, {pinALeft: pinALeft, pinBLeft: pinBLeft});
      };

      var onPinMouseUp = function (upEvt) {
        refreshSliderState(upEvt);
        document.removeEventListener('mouseup', onPinMouseUp);
        document.removeEventListener('mousemove', onPinMouseMove);
      };

      var onPinMouseMove = function (moveEvt) {
        refreshSliderState(moveEvt);
      };

      var currentPin = evt.target;
      var sliderX = window.dom.getXCoordinate(links.rangeFilter);
      var pinX = window.dom.getXCoordinate(currentPin);
      var shiftX = evt.pageX - pinX;
      evt.preventDefault();
      document.addEventListener('mouseup', onPinMouseUp);
      document.addEventListener('mousemove', onPinMouseMove);
    };


    if (links.rangeFilter && links.rangeLine && links.rangePinA && links.rangePinB) {
      links.rangePinA.addEventListener('mousedown', onPinMouseDown);
      links.rangePinB.addEventListener('mousedown', onPinMouseDown);
    }
  };

  window.slider = {
    init: init
  };

})();
