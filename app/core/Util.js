Ext.define('NP.core.Util', {
	singleton: true,
	
	requires: 'Ext.util.Format',
	
	isFunction: function(obj) {
		return Object.prototype.toString.call(obj) == '[object Function]';
	},
	
	isArray: function(obj) {
		return Object.prototype.toString.call(obj) == '[object Array]';
	},
	
	isObject: function(obj) {
		return Object.prototype.toString.call(obj) == '[object Object]';
	},
	
	dateDiff: function(part, date1, date2) {
		var diff = date1.getTime() - date2.getTime();
		var l = 1, s = 1000, n = s*60, h = n*60, d = h*24, ww = d * 7, m = d*30, yyyy = d*365;
		
		var map = {
			l: l,
			s: s,
			n: n,
			h: h,
			d: d,
			ww: ww,
			m: m,
			yyyy: yyyy
		};
		
		diff = diff / map[part];
		
		if (diff < 0) {
			return Math.ceil(diff);
		} else {
			return Math.floor(diff);
		}
	},
	
	// This is to be used on model string fields; it ensures that the field is treated as a string (as opposed to a number or boolean)
	//and trims it to remove whitespaces added to CF queries in order to serialize JSON properly for values like "Yes" and "No" 
	modelStringConverter: function(val, rec) {
		var newVal = val;
		if (newVal == null) {
			newVal = '';
		}
		if (typeof newVal != 'string') {
			newVal = newVal.toString();
		}
		return Ext.String.trim(newVal);
	},
	
	currencyRenderer: function(val) {
		return Ext.util.Format.currency(val);
	}
	
});