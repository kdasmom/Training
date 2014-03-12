/**
 * The AbstractReport class is to be extended by concrete report classes that define
 * some standard functions for reports
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.report.AbstractReport', {
	
	initForm: function() {
		throw 'You must define initForm() in a concrete class';
	},

	validateForm: function() {
		throw 'You must define validateForm() in a concrete class';
	},

	getOptions: function() {
		throw 'You must define getOptions() in a concrete class';
	},

	getExtraParams: function() {
		throw 'You must define getExtraParams() in a concrete class';
	}
});