/**
 * Grid column for Entity Amount
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.Amount', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.amount',

	requires: ['NP.lib.core.Util'],

	text     : 'Amount',
	dataIndex: 'entity_amount',
	align    : 'right',

	initComponent: function() {
		this.renderer = NP.lib.core.Util.currencyRenderer;
		
		this.callParent(arguments);
	}
});