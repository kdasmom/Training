/**
 * Grid column for Sent To Vendor
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.gridcol.SentToVendor', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.po.gridcol.senttovendor',

	text     : 'Sent To Vendor',
	dataIndex: 'sent_to_vendor_datetm'
});