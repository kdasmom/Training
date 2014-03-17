/**
 * Grid column for Invoice Pay By
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.PayBy', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.invoice.gridcol.payby',

	requires: ['NP.lib.core.Translator'],

	text     : 'Pay By',
	dataIndex: 'invoicepayment_type',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});