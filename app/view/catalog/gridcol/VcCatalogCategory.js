/**
 * Created by Andrey Baranov
 * date: 11/28/13 4:37 PM
 */


Ext.define('NP.view.catalog.gridcol.VcCatalogCategory', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.catalog.gridcol.vccatalogcategory',

	text     : 'Category',
	dataIndex: 'vccat_name',
	renderer: function(val, meta, rec) {
		return '<img src="/files/categories/vc_cat_' + val.replace(/ /gi,'_') + '.jpg"/>'
	}
});