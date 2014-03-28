/**
 * Grid column for Invoice On Hold Notes
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.OnHoldNotes', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.invoice.gridcol.onholdnotes',

	requires: ['NP.lib.core.Translator'],

	text     : 'On Hold Notes',
	dataIndex: 'invoice_onhold_notes',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});