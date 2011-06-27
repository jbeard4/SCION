//adapted from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Reduce
require.def(function(){
	return function(arr,fun,initial){
		if(arr.reduce){
			return initial ? arr.reduce(fun,initial) : arr.reduce(fun);
		}else{
			var len = arr.length;
			if (typeof fun != "function")
				throw new TypeError();

			// no value to return if no initial value and an empty array
			if (len == 0 && arguments.length == 2)
				throw new TypeError();

			var i = 0;
			if (arguments.length >= 3) {
				var rv = arguments[2];
			}
			else {
				do {
					if (i in arr) {
						var rv = arr[i++];
						break;
					}

					// if array contains no values, no initial value to return
					if (++i >= len)
						throw new TypeError();
				}
				while (true);
			}

			for (; i < len; i++) {
				if (i in arr)
					rv = fun.call(undefined, rv, arr[i], i, arr);
			}

			return rv;
		}
	}
});
