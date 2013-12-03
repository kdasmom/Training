/**
 * Grid column for Invoice Due Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.DueDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.invoice.gridcol.duedate',

	requires: ['NP.lib.core.Translator'],

	text     : 'Due Date',
	dataIndex: 'invoice_duedate',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});