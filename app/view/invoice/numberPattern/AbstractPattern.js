/**
 * Abstract class for validating an invoice number or stripping/replacing invalid characters from it
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.numberPattern.AbstractPattern', {
	getPattern: function() {
		throw 'You must implement the getPattern() in your pattern';
	},

	getModifiers: function() {
		return 'gi';
	}
});