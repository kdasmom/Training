// Add a capitalize formatting function
Ext.define('overrides.util.Format', {
	override: 'Ext.util.Format',
	
	capitalize: function(val) {
	    var re = /(^|[^\w])([a-z])/g,
	        fn = function(m, a, b) {
	            return a + b.toUpperCase();
	        };
	    return val.replace(re, fn);
	}
});