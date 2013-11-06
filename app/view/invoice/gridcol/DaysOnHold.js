/**
 * Grid column for Invoice Number of Days On Hold
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.DaysOnHold', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.invoice.gridcol.daysonhold',

	requires: ['NP.lib.core.Translator'],

	text     : 'Number of Days On Hold',
	dataIndex: 'invoice_days_onhold',
	align    : 'right',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});