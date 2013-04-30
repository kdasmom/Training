/**
 * Grid column for catalog item type
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalog.gridcol.VcItemType', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.catalog.gridcol.vcitemtype',

	text     : 'Item Type',
	dataIndex: 'vcitem_type',
	renderer : function(val, meta, rec) {
		if (rec.get('UNSPSC_Commodity_Commodity') === null) {
			return val;
		} else {
			return rec.get('UNSPSC_Commodity_CommodityTitle');
		}
	}
});