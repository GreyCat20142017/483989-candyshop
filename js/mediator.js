'use strict';

(function () {

	var Bus = function () {
		this.listeners = {};
	};	

	Bus.prototype.addEvent = function (event, listener) {
		(this.listeners[event] || (this.listeners[event] = [])).push(listener);
		return this;
	};

	Bus.prototype.removeEvent = function (event, listener) {
		if (listener) {
			this.listeners[event] = (this.listeners[event] || []).filter(function (item) {return item !== listener});
		} else {
			this.listeners[event] = [];
		}
		return this;
	};

	Bus.prototype.emitEvent = function (event, data) {
		(this.listeners[event] || (this.listeners[event] = [])).forEach(function (item) {return item(data)});
		return this;
	};


 window.mediator = {
 	bus: new Bus
 }

})();