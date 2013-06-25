/**
 * Grid column for catalog item category
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalog.gridcol.VcItemCategory', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.catalog.gridcol.vcitemcategory',

	text     : 'Category',
	dataIndex: 'vcitem_category_name',
	renderer : function(val, meta, rec) {
		if (rec.get('UNSPSC_Commodity_Commodity') === null) {
			return val;
		} else {
			return rec.getUnspscCommodity().get('UNSPSC_Commodity_FamilyTitle');
		}
	}
});