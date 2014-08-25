function toCamelCase(str) {
	return str.replace(/_[a-z0-9]/g, function(replace){return replace.charAt(1).toUpperCase();})
}
FastObj = function(keys, maxSize) {
	return (function(){
		var createIndex = 0, template = [], length=0, padding=2, typeSize = padding+(keys.length),arr = new Array(maxSize*typeSize);
		template[0] = undefined;
		template[1] = false; // used or not
		for ( var i = 0; i < keys.length; i++ ) {
			template[i+2] = undefined;
		}
		var templateFuncs = [];
		for ( var i = 0 ;i < keys.length; i++ ) {
			templateFuncs[toCamelCase("get_"+keys[i])] = (function(i){ 
				return function(){ 
					return arr[this.index+i]
				}
			})(i+padding);
			templateFuncs[toCamelCase("set_"+keys[i])] = (function(i){ 
				return function(val){ 
					arr[this.index+i] = val;
				}
			})(i+padding);
		}
		var innerType = function(i) {
			this.index = i*typeSize;
			for ( var name in templateFuncs ) {
				this[name] = templateFuncs[name];
			}

		}
		function nextFunc(){return arr[this.index+typeSize];}
		function create() {
			var type = new innerType(createIndex);

			var pos = createIndex*typeSize;
			for ( var i = 0; i < typeSize; i++ ) {
				arr[pos+i] = template[i];
			}
			arr[pos] = type;
			createIndex++;
			length++;
			type.next = nextFunc;
			return type;
		}
		return {
			new: create,
			getLength: function(){return length;},
			get: function(i){
				return arr[i*typeSize];
			}
		};
	})();

}