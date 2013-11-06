/**
 * Grid column for Invoice On Hold By
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.OnHoldBy', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.invoice.gridcol.onholdby',

	requires: ['NP.lib.core.Translator'],

	text     : 'On Hold By',
	dataIndex: 'invoice_onhold_by',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});