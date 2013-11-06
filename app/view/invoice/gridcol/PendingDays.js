/**
 * Grid column for Invoice Pending Days
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.PendingDays', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.invoice.gridcol.pendingdays',

	requires: ['NP.lib.core.Translator'],

	text     : 'Days Pending',
	dataIndex: 'invoice_pending_days',
	align    : 'right',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});