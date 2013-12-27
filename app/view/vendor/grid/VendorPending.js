/**
 * @author Baranov A.V.
 * @date 10/2/13
 */


Ext.define('NP.view.vendor.grid.VendorPending', {
	alias: 'widget.vendor.grid.vendorpending',

	title: 'Pending',

	cols: [
		'DateSubmitted',
		'VendorName',
		'ApprovalType',
		'SubmittedBy',
		'VendorStatus'
	]
});