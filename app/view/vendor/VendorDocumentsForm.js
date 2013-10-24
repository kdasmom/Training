/**
 * Created by rnixx on 10/22/13.
 */

Ext.define('NP.view.vendor.VendorDocumentsForm', {
	extend: 'Ext.container.Container',
	alias: 'widget.vendor.vendordocumentsform',

	requires: [
		'NP.lib.core.Security',
	],

	padding: 8,

	// For localization
	title					: 'Vendor documents',
	invoiceDocumentsTablabel		: 'Invoice',
	purchaseOrderTabLabel		: 'Purchase Order',

	initComponent: function() {
		var that = this;

		this.callParent(arguments);
	}
});