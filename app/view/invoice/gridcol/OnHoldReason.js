/**
 * Grid column for Invoice On Hold Reason
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.OnHoldReason', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.invoice.gridcol.onholdreason',

	requires: ['NP.lib.core.Translator'],

	text     : 'On Hold Reason',
	dataIndex: 'invoice_onhold_reason',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});