/**
 * Grid column for Vendor
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.vendor.gridcol.VendorName', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.vendor.gridcol.vendorname',

	text     : 'Vendor',
	dataIndex: 'vendor_name',
	
	renderer: function(val, meta, rec) {
		if (rec.getVendorsite) {
			return rec.getVendorsite().getVendor().get('vendor_name');
		} else if (rec.getVendor) {
			return rec.getVendor().get('vendor_name');
		}

		return val;
	}
});