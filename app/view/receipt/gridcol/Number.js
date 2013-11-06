/**
 * Grid column for Receipt Number
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.receipt.gridcol.Number', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.receipt.gridcol.number',

	requires: ['NP.lib.core.Translator'],

	text     : 'Receipt Number',
	dataIndex: 'receipt_ref',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});