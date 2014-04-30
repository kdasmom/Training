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
		'NP.lib.ui.VerticalTabPanel',
		'NP.lib.core.Translator'
	],

	title: 'Vendor Documents',
	padding: 8,
	layout: 'fit',
	autoScroll: true,
//	flex: 1,
	border: false,

	initComponent: function() {
		var that = this;

		that.title = NP.Translator.translate(that.title);

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