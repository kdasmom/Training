/**
 * Grid column for Number of Items in Catalog
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalog.gridcol.Type', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.catalog.gridcol.type',

	text     : 'Type', 
	dataIndex: 'vc_catalogtype',
	renderer: function(val) {
		if (val == 'url' || val == 'pdf') {
			return val.toUpperCase();
		} else {
			return Ext.util.Format.capitalize(val);
		}
	}
});