/**
 * Grid column for catalog item price
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalog.gridcol.VcItemPrice', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.catalog.gridcol.vcitemprice',

	requires: ['NP.lib.core.Util'],

	text     : 'Item Price',
	dataIndex: 'vcitem_price',
	align    : 'right',

	initComponent: function() {
		this.renderer = NP.lib.core.Util.currencyRenderer;
		this.callParent(arguments);
	}
});