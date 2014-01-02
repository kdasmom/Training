/**
 * Created by rnixx on 10/22/13.
 */

Ext.define('NP.view.vendor.VendorDocumentsForm', {
//	extend: 'Ext.container.Container',
	extend: 'Ext.panel.Panel',
	alias: 'widget.vendor.vendordocumentsform',

	requires: [
		'NP.lib.core.Security',
		'NP.view.vendor.InvoiceDocuments',
		'NP.view.vendor.PurchaseOrder',
		'NP.lib.ui.VerticalTabPanel'
	],

	padding: 8,
	layout: 'fit',
	autoScroll: true,
//	flex: 1,
	border: false,

	// For localization
	title					: 'Vendor documents',
	invoiceDocumentsTablabel		: 'Invoice',
	purchaseOrderTabLabel		: 'Purchase Order',

	initComponent: function() {
		var that = this;

		this.items = [{
			xtype : 'verticaltabpanel',
			border: false,
			defaults: {
				padding: 8
			},
			items : [
				{ xtype: 'vendor.invoicedocuments'},
				{ xtype: 'vendor.purchaseorder'}
			]
		}];

		this.callParent(arguments);
	}
});