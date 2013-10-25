/**
 * Grid column for Invoice Number
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.Number', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.invoice.gridcol.number',

	requires: ['NP.lib.core.Translator'],

	text     : 'Invoice Number',
	dataIndex: 'invoice_ref',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});