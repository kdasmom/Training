/**
 * Grid column for Vendor Code
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.vendor.gridcol.VendorCode', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.vendor.gridcol.vendorcode',

	text     : 'Vendor Code',
	dataIndex: 'vendor_id_alt',

	renderer: function(val, meta, rec) {
		if (rec.getVendorsite) {
			return rec.getVendorsite().getVendor().get('vendor_id_alt');
		} else if (rec.getVendor) {
			return rec.getVendor().get('vendor_id_alt');
		}

		return val;
	}
});