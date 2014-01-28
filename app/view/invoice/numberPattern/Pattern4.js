/**
 * A pattern for validating an invoice number or stripping/replacing invalid characters from it
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.numberPattern.Pattern4', {
	extend: 'NP.view.invoice.numberPattern.AbstractPattern',

	getPattern: function() {
		return '[A-Z0-9\\-]';
	}
});