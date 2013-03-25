/**
 * The Util class contains utility functions that don't belong in any other module
 *
 * @author Thomas Messier
 * @singleton
 * @requires Ext.util.Format
 */
Ext.define('NP.lib.core.Util', {
	alternateClassName: ['NP.Util'],
	singleton: true,
	
	requires: 'Ext.util.Format',
	
	/**
	 * Checks if an object is a function or not
	 @param  {Mixed} obj
	 @return {Boolean}
	 */
	isFunction: function(obj) {
		return Object.prototype.toString.call(obj) == '[object Function]';
	},
	
	/**
	 * Checks if an object is an array or not
	 @param  {Mixed} obj
	 @return {Boolean}
	 */
	isArray: function(obj) {
		return Object.prototype.toString.call(obj) == '[object Array]';
	},
	
	/**
	 * Checks if an object is a javascript Object or not
	 @param  {Mixed} obj
	 @return {Boolean}
	 */
	isObject: function(obj) {
		return Object.prototype.toString.call(obj) == '[object Object]';
	},
	

	/**
	 * Calculates the difference in time between two dates
	 *
	 * Example usage:
	 * var diff = NP.Util.dateDiff('m', '2013-02-01', '2013-01-01');
	 * console.log(diff); // Outputs 1
	 *
	 @param  {"l"/"s"/"n"/"h"/"d"/"ww"/"m","yyyy"} part l=millisecond; s=seconds; n=minutes; h=hours; d=days; w=weeks; m=months; y=years
	 @param  {Date} date1
	 @param  {Date} date2
	 @return {Number}
	 */
	dateDiff: function(part, date1, date2) {
		var diff = date1.getTime() - date2.getTime();
		var l = 1, s = 1000, n = s*60, h = n*60, d = h*24, w = d * 7, m = d*30, y = d*365;
		
		var map = {
			l: l,
			s: s,
			n: n,
			h: h,
			d: d,
			w: w,
			m: m,
			y: y
		};
		
		diff = diff / map[part];
		
		if (diff < 0) {
			return Math.ceil(diff);
		} else {
			return Math.floor(diff);
		}
	},
	
	/**
	 * Function to render currency values
	 * @param  {Number/string}
	 * @return {String}
	 */
	currencyRenderer: function(val) {
		return Ext.util.Format.currency(val);
	}
	
});