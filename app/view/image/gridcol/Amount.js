/**
 * Grid column for Entity Amount
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.image.gridcol.Amount', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.image.gridcol.amount',

	requires: ['NP.lib.core.Util'],

	text     : 'Amount',
	dataIndex: 'Image_Index_Amount',
	align    : 'right',

	initComponent: function() {
		this.renderer = NP.lib.core.Util.currencyRenderer;
		
		this.callParent(arguments);
	}
});