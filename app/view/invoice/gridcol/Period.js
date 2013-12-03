/**
 * Grid column for Invoice Period
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.Period', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.invoice.gridcol.period',

	requires: ['NP.lib.core.Translator'],

	text     : 'Post Date',
	dataIndex: 'invoice_period',
	format   : 'm/Y',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});