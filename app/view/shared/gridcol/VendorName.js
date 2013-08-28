/**
 * Grid column for Vendor
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.VendorName', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.vendorname',

	text     : 'Vendor',
	dataIndex: 'vendor_name',
	
	renderer: function(val, meta, rec) {
		if (rec.raw.vendorsite_id) {
			return rec.getVendorsite().getVendor().get('vendor_name');
		} else if (rec.raw.vendor_id) {
			return rec.getVendor().get('vendor_name');
		}

		return val;
	}
});