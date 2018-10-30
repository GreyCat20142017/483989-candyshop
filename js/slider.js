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

    var setSliderToMinMax = function () {
      links.rangePinA.style.left = '0%';
      links.rangePinB.style.left = '100%';
      links.rangeLine.style.left =  '0%';
      links.rangeLine.style.right = '0%';
    };

    var onPinMouseDown = function (evt) {
      var refreshSliderState = function (moveUpEvt) {
        var newX = moveUpEvt.pageX - shiftX - sliderX;
        var rangeLeft = window.dom.getXCoordinate(links.rangeFilter);
        var sliderValue = Math.floor(getLimitedValue(newX, 0, rangeWidth) / rangeWidth * 100);

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

        bus.emitEvent(events.CHANGE_PRICE, {
         firstValue: getLimitedValue(parseInt(getComputedStyle(links.rangePinA).left , 10) / rangeWidth * 100, 0 , 100),
         secondValue: getLimitedValue(parseInt(getComputedStyle(links.rangePinB).left , 10) / rangeWidth * 100, 0 , 100)});
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

    var rangeWidth = links.rangeFilter.offsetWidth;
    if (links.rangeFilter && links.rangeLine && links.rangePinA && links.rangePinB) {
      links.rangePinA.addEventListener('mousedown', onPinMouseDown);
      links.rangePinB.addEventListener('mousedown', onPinMouseDown);
    };
    bus.addEvent('FILTER_INIT', setSliderToMinMax);
  };

  window.slider = {
    init: init
  };

})();
