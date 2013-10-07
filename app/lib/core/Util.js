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
	
	requires: ['NP.lib.core.Config'],

	monthDays: {
		1: 31,
		2: 28,
		3: 31,
		4: 30,
		5: 31,
		6: 30,
		7: 31,
		8: 31,
		9: 30,
		10: 31,
		11: 30,
		12: 31
	},

	/**
	 * Shows a window with a message for a certain amount of time that eventually fades out
	 * @param  {Object} windowOptions      Supports all options for the window object, with certain defaults
	 * @param  {String} windowOptions.html This is the only required option for this and is the text that will show in the main content area of the window. HTML is allowed.
	 * @param  {Number} showDuration       How long the window should show before it starts fading
	 * @param  {Number} fadeDuration       How long the fade should last until the window completely disappears
	 */
	showFadingWindow: function(windowOptions, showDuration, fadeDuration) {
		if (!showDuration) var showDuration = 2000;
		if (!fadeDuration) var fadeDuration = 2000;

		Ext.applyIf(windowOptions, {
			width      : 250,
			height     : 80,
			bodyPadding: 16,
			closable   : false,
			title      : 'Info'
		});
		windowOptions.html = '<div align="center">' + windowOptions.html + '</div>';

		var win = new Ext.create('Ext.window.Window', windowOptions);
		win.show();
		
		setTimeout(function() {
			win.animate({
				duration: fadeDuration,
		        to: {
		            opacity: 0
		        },
		        callback: function() {
		    		win.destroy();
		        }
		    });
		}, showDuration);
	},

	/**
	 * Creates a form element in the body of the HTML document that can be used to append file fields when uploading
	 * @param  {String}      [formCmpSelector] An optional component selector for a Ext.form.Panel object from which you want to extract file fields and add them to the form HTML element you are creating
	 * @return {HTMLElement}                   The HTML element for the form node created in the document
	 */
	createFormForUpload: function(formCmpSelector) {
		var time = new Date().getTime();
		var formId = 'fileupload-form-' + time;
		var formEl = Ext.DomHelper.append(Ext.getBody(), '<form id="'+formId+'" method="POST" enctype="multipart/form-data" class="x-hide-display"></form>');

		if (formCmpSelector) {
			var fields = Ext.ComponentQuery.query(formCmpSelector)[0].getForm().getFields();
			fields.each(function(field) {
				if (field.getXType() == 'filefield') {
					formEl.appendChild(field.extractFileInput());
				}
			});
		}

		return formEl;
	},

	/**
	 * Takes an array of objects and returns a simple array using the value of the specified field for each record
	 * @param  {Object[]} records An array of objects 
	 * @param  {String}   field   The field you want values for in the array
	 * @return {Array}
	 */
	valueList: function(records, field) {
		var list = [];
		for (var i=0; i<records.length; i++) {
			list.push(records[i][field]);
		}

		return list;
	},

	/**
	 * Checks if an object is a function or not
	 * @param  {Mixed} obj
	 * @return {Boolean}
	 */
	isFunction: function(obj) {
		return Object.prototype.toString.call(obj) == '[object Function]';
	},
	
	/**
	 * Checks if an object is an array or not
	 * @param  {Mixed} obj
	 * @return {Boolean}
	 */
	isArray: function(obj) {
		return Object.prototype.toString.call(obj) == '[object Array]';
	},
	
	/**
	 * Checks if an object is a javascript Object or not
	 * @param  {Mixed} obj
	 * @return {Boolean}
	 */
	isObject: function(obj) {
		return Object.prototype.toString.call(obj) == '[object Object]';
	},
	
	/**
	 * Checks if a certain combination of year, month and day is valid
	 * @param  {Number} year
	 * @param  {Number} month
	 * @param  {Number} day
	 * @return {Boolean}
	 */
	isValidDayOfMonth: function(year, month, day) {
		if (month < 1 || month > 12) {
			throw 'Invalid month argument. month must be between 1 and 12.'
		}

		if (day < 1) {
			return false;
		}
		
		var maxDays = this.monthDays[month];
		// Account for february leap years
		if (month == 2) {
			if ((year % 400 == 0) || (year % 4 == 0 && year && 100 != 0)) {
				maxDays = 29;
			}
		}
		if (day > maxDays) {
			return false;
		}

		return true;
	},

	/**
	 * Calculates the difference in time between two dates
	 *
	 * Example usage:
	 * var diff = NP.Util.dateDiff('m', '2013-02-01', '2013-01-01');
	 * console.log(diff); // Outputs 1
	 *
	 * @param  {"l"/"s"/"n"/"h"/"d"/"ww"/"m","yyyy"} part l=millisecond; s=seconds; n=minutes; h=hours; d=days; w=weeks; m=months; y=years
	 * @param  {Date} date1
	 * @param  {Date} date2
	 * @return {Number}
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
	 * @param  {Number/String}
	 * @return {String}
	 */
	currencyRenderer: function(val) {
		var isNegative = false;
		
		if (val < 0) {
			val = Math.abs(val);
			isNegative = true;
		}
		val = Ext.util.Format.currency(val, NP.Config.getSetting('PN.Intl.currencySymbol', '$'));
		
		if (isNegative) {
			val = '(' + val + ')';
		}

		return val;
	},
	
	/**
	 * Returns an array with the list of values checked for a group of checkboxes using the same name.
	 * Useful in the case where you can't use an Ext checkbox group for some reason (checkboxes span)
	 * multiple tabs, for example.
	 * @param  {String} name The value of the "name" field of the checkboxes
	 * @return {Array}       An array with all the inputValue values for the fields that are checked
	 */
	getCheckboxValue: function(name, selector) {
		selector = selector + ' ' || '';
		var checkboxes = Ext.ComponentQuery.query(selector + 'checkbox[name="'+name+'"]');
		var value = [];
		Ext.Array.each(checkboxes, function(checkbox) {
			if (checkbox.getValue()) {
				value.push(checkbox.getSubmitValue());
			}
		});
		return value;
	},

	/**
	 * This is a function to retrieve the idProperty from a model class, seeing as there's no built-in function
	 * to do it.
	 *
	 * @param  {String} modelClass Class as a full namespaced class name
	 * @return {String}            The name of the field that's the primary key for the model
	 */
	getIdProperty: function(modelClass) {
		return Ext.ClassManager.get('NP.model.' + modelClass).getFields()[0].name;
	}
});