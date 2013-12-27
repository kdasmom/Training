/**
 * Created by rnixx on 10/25/13.
 */

Ext.define('NP.view.vendor.PurchaseOrder', {
	extend: 'Ext.container.Container',
	alias: 'widget.vendor.purchaseorder',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security',
		'NP.lib.ui.ComboBox',
		'NP.lib.ui.Grid'
	],

	padding: 8,

	// For localization
	title						: 'Purchase Order',
	scannedDateColumnTitle		: 'Scanned date',
	sourceColumnTitle			: 'Source',
	docTypeColumnTitle			: 'Doc type',
	docNameColumnTitle			: 'Document name',
	refNumberColumnTitle			: 'Ref number',
	amountColumnTitle			: 'Amount',
	selectAllBtnText				: 'Select/Unselect all',
	actionButtonText				: 'Go',


	initComponent: function() {
		var that = this;
//		this.layout = 'fit';
		var actionsStore = new Ext.data.ArrayStore({
			data   : [['Delete selected'], ['Reassign selected']],
			fields : ['action']
		});

		this.items = [
			{
				xtype: 'container',
				layout: 'form',
				padding: '5 0',
				flex: 1,
				items: [
					{
						xtype: 'fieldcontainer',
						layout: 'hbox',
						items: [
							{
								xtype: 'button',
								text: this.selectAllBtnText,
								margin: '0 5 5 0'
							},
							{
								xtype: 'combobox',
								store: actionsStore,
								displayField: 'action',
								padding: '0 0 5 0',
								margin: '-2 5 5 0'
							},
							{
								xtype: 'button',
								text: this.actionButtonText,
								margin: '0 5 5 0'
							}
						]
					}
				]
			},
			{
				xtype: 'customgrid',
				store: [],
				border: false,
				columns: [
					{
						text: this.scannedDateColumnTitle,
						flex: 1
					},
					{
						text: this.sourceColumnTitle,
						flex: 1
					},
					{
						text: this.docTypeColumnTitle,
						flex: 1
					},
					{
						text: this.docNameColumnTitle,
						flex: 1
					},
					{
						text: this.refNumberColumnTitle,
						flex: 1
					},
					{
						text: this.amountColumnTitle,
						flex: 1
					},
					{
						xtype: 'actioncolumn',
						flex: 1
					}
				]
			}
		];
		this.callParent(arguments);
	}
});