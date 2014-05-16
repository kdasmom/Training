/**
 * Created by Andrey Baranov
 * date: 5/15/2014 1:27 PM
 */

Ext.define('NP.view.importing.InvoiceExportGrid', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.importing.invoiceexportgrid',
	requires: [
		'NP.lib.core.Config',
		'NP.view.shared.button.Cancel',
		'NP.view.shared.button.Inactivate',
		'NP.view.shared.button.Activate',
		'NP.view.shared.button.Process',
		'NP.lib.ui.Grid'
	],

	border: false,
	bodyPadding: 8,

	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	autoScroll: true,


	// For localization
	acceptBtnText   : 'View/Save File',
	declineBtnText  : 'Decline',
	processBtnText  : 'Mark Invoices as Sent',
	instructionsText: 'If you exit from the Import/Export Utility without Accepting, the import/export in process will be abandoned. Once the invoices are marked as Sent, they can not be exported to Excel. Please save and validate the Excel file before clicking Mark Items as Sent.',
	gridTitle       : 'Preview',

	initComponent: function() {
		this.tbar = [
			{ xtype: 'shared.button.cancel'},
			{ xtype: 'shared.button.inactivate', text: this.declineBtnText },
			{ xtype: 'shared.button.activate', text: this.acceptBtnText },
			{ xtype: 'shared.button.process', text: this.processBtnText }
		];

		this.items = [
			{
				xtype: 'component',
				margin: '0 0 8 0',
				html: NP.Translator.translate(this.instructionsText)
			},
			{
				xtype: 'customgrid',
				paging			: true,
				itemId: 'invoiceGrid',
				border: false,
				autoScroll: true,
				columns: [
					{
						xtype: 'datecolumn',
						dataIndex: 'invoice_datetm',
						text: NP.Translator.translate('Invoice Date'),
						flex: 0.5
					},
					{
						dataIndex: 'invoice_ref',
						text: NP.Translator.translate('Invoice Number'),
						flex: 0.5
					},
					{
						dataIndex: 'property_name',
						text: NP.Translator.translate('Property'),
						flex: 1,
						renderer: function(val, meta, record) {
							return val + '(' + record.raw['property_id_alt'] + ')';
						}
					},
					{
						dataIndex: 'vendor_name',
						text: NP.Translator.translate('Vendor'),
						flex: 1
					},
					{
						dataIndex: 'invoice_total',
						text: NP.Translator.translate('Total'),
						flex: 0.5,
						xtype    : 'numbercolumn',
						renderer : function(val, meta, record) {
							return NP.Util.currencyRenderer(record.raw.invoice_total);
						}
					}
				],
				store: Ext.create('NP.store.invoice.Invoices', {
					service: 'InvoiceService',
					action: 'getPreviewForTheService',
					method: 'POST',
					extraParams: {
						integration_package_id: null,
						properties: []
					}
				})
			}
		];

		this.callParent(arguments);
	}
});