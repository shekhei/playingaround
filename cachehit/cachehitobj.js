function toCamelCase(str) {
	return str.replace(/_[a-z0-9]/g, function(replace){return replace.charAt(1).toUpperCase();})
}
FastObj = function(keys, maxSize) {
	return (function(){
		var arr = [], createIndex = 0, template = [], length=0, typeSize = 2+(keys.length*2);
		template[0] = undefined;
		template[1] = false; // used or not
		for ( var i = 0; i < keys.length; i++ ) {
			template[i+2] = undefined;
		}
		var templateFuncs = [];
		for ( var i = 0 ;i < keys.length; i++ ) {
			templateFuncs[toCamelCase("get_"+keys[i])] = (function(i){ 
				return function(){ return arr[this.index+i]}
			})(i+1);
			templateFuncs[toCamelCase("set_"+keys[i])] = (function(i){ 
				return function(val){ arr[this.index+i] = val;}
			})(i+1);
		}
		var innerType = function() {
			this.index = i;
			for ( var name in templateFuncs ) {
				this[name] = templateFuncs[name];
			}
		}
		function create() {
			var type = new innerType(createIndex);

			var pos = createIndex*typeSize;
			for ( var i = 0; i < typeSize; i++ ) {
				arr[pos+i] = template[i];
			}
			arr[pos] = type;
						createIndex++;
			length++;
			return type;
		}
		return {
			new: create,
			getLength: function(){return length;},
			get: function(i){return arr[i*typeSize];}
		};
	})();

}