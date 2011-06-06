require.def("src/javascript/scxml/cgf/util/base",
function(){
	//some compatibility stuff for IE
	//TODO: move out into another file
	if (!Array.indexOf) {
	    Array.prototype.indexOf = function(obj) {
		for (var i = 0; i < this.length; i++) {
		    if (this[i] == obj) {
			return i;
		    }
		}
		return -1;
	    }
	}

	if (!Array.map) {
	    Array.prototype.map = function(fn) {
		var toReturn = [];
		for (var i = 0; i < this.length; i++) {
		    toReturn[i] = fn(this[i]);
		}
		return toReturn;
	    }
	}

	if (!Array.forEach) {
	    Array.prototype.forEach = function(fn) {
		for (var i = 0; i < this.length; i++) {
		    fn(this[i]);
		}
		return undefined;
	    }
	}

	if(!Array.some){
		Array.prototype.some = function(fn){
			for(var i=0; i < this.length; i++){
				if(fn(this[i])) return true;
			}
			return false;
		}
	}

	//add in built-in function reduce for js implementations that do not support it
	//this code is from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Reduce#Compatibility
	if (!Array.prototype.reduce) {
		Array.prototype.reduce = function(fun /*, initial*/) {
			var len = this.length >>> 0;
			if (typeof fun != "function")
				throw new TypeError();

			// no value to return if no initial value and an empty array
			if (len == 0 && arguments.length == 1)
				throw new TypeError();

			var i = 0;
			if (arguments.length >= 2) {
				var rv = arguments[1];
			}
			else {
				do {
					if (i in this) {
						var rv = this[i++];
						break;
					}

					// if array contains no values, no initial value to return
					if (++i >= len)
						throw new TypeError();
				}
				while (true);
			}

			for (; i < len; i++) {
				if (i in this)
					rv = fun.call(undefined, rv, this[i], i, this);
			}

			return rv;
		};
	}
});

