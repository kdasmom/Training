/**
 * Created by Andrey Baranov
 * date: 12/5/13 3:54 PM
 */



Ext.define('NP.view.catalog.CreateOrderGrid', {
	extend: 'NP.lib.ui.Grid',
	alias : 'widget.catalog.createordergrid',

	requires: [
		'NP.lib.core.Util'
	],

	paging: true,
	overflowY: 'scroll',

	initComponent: function() {
		this.pagingToolbarButtons = [
			{
				xtype: 'shared.button.new',
				text: this.addNewVendorButtonText
			}
		];

		this.columns = [
			{
				dataIndex: 'vcitem_number',
				text: NP.Translator.translate('Item number'),
				flex: 1
			},
			{
				dataIndex: 'vcitem_desc',
				text: NP.Translator.translate('Item description'),
				flex: 1
			},
			{
				text: NP.Translator.translate('Item property'),
				flex: 1
			},
			{
				text: NP.Translator.translate('Unit'),
				flex: 1
			},
			{
				text: NP.Translator.translate('Unit type'),
				flex: 1
			},
			{
				dataIndex: 'vcitem_price',
				text: NP.Translator.translate('Item price'),
				renderer: function(val, meta, rec) {
					return NP.Util.currencyRenderer(rec.get('vcitem_price'));
				},
				flex: 1
			},
			{
				dataIndex: 'vcorder_qty',
				text: NP.Translator.translate('Qty'),
				flex: 1
			},
			{
				text: NP.Translator.translate('Total'),
				flex: 1,
				renderer: function(value, meta, rec) {
					return NP.Util.currencyRenderer(rec.get('vcitem_price') * rec.get('vcorder_qty'));
				}
			},
			{
				text: NP.Translator.translate('Taxable'),
				flex: 1
			},
			{
				text: NP.Translator.translate('Gl Code'),
				flex: 1
			}
		];

		this.store = Ext.create('NP.store.catalog.VcOrders', {
			service: 'CatalogService',
			action: 'getOrderItems',
			extraParams: {
				userprofile_id: null,
				vc_id: null,
				property_id: null,
				vcorder_id: null
			},
			autoLoad: true
		});

		this.callParent(arguments);
	}

});