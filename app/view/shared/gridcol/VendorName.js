/**
 * Grid column for Vendor
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.VendorName', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.vendorname',

	text     : 'Vendor',
	dataIndex: 'vendor_name'
});