/**
 * Grid column for Vendor Code
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.VendorCode', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.vendorcode',

	text     : 'Vendor Code',
	dataIndex: 'vendor_id_alt',
	
	renderer: function(val, meta, rec) {
		if (rec.raw.vendorsite_id) {
			return rec.getVendorsite().getVendor().get('vendor_id_alt');
		} else if (rec.raw.vendor_id) {
			return rec.getVendor().get('vendor_id_alt');
		}

		return val;
	}
});