/**
 * Created by Andrey Baranov
 * date: 12/5/13 3:54 PM
 */



Ext.define('NP.view.catalog.CreateOrderGrid', {
	extend: 'NP.lib.ui.Grid',
	alias : 'widget.catalog.createordergrid',

	requires: [
		'NP.lib.core.Util',
		'NP.view.shared.button.PurchaseOrder'
	],

	paging: true,
	overflowY: 'scroll',

	initComponent: function() {
		var that = this;
		console.log('vendorsite_id": ', that.vendorsite_id);

		this.allowUnitAttach =  NP.Config.getSetting('PN.VendorOptions.ValidateName');
		var unitsStore = Ext.create('NP.store.property.Units', {
			service: 'PropertyService',
			action: 'getUnits',
			extraParams: {
				property_id: that.property_id
			}
		});

		var unitTypesStore = Ext.create('NP.store.property.UnitTypes', {
			service: 'PropertyService',
			action: 'getUnitTypeMeasByPropertyId',
			extraParams: {
				property_id: that.property_id
			}
		});

		var glAccountsStore = Ext.create('NP.store.gl.GlAccounts', {
			service: 'GLService',
			action: 'getGLUI',
			extraParams: {
				property_id: that.property_id,
				vendorsite_id: that.vendorsite_id
			}
		});


		this.pagingToolbarButtons = [
			{
				xtype: 'shared.button.purchaseorder'
			}
		];

		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		});

		this.plugins = [cellEditing];

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
				flex: 1,
				dataIndex: 'property_name',
				editor:
				{
					xtype: 'customcombo',
					store: Ext.create('NP.store.property.Properties', {
						service: 'CatalogService',
						action: 'getOrderProperties',
						extraParams: {
							vc_id: this.vc_id,
							userprofile_id: NP.Security.getUser().get('userprofile_id'),
							delegation_to_userprofile_id: NP.Security.getUser().get('userprofile_id')
						},
						autoLoad: true
					}),
					displayField: 'property_name',
					valueField: 'property_name',
					queryMode: 'local',
					editable: false,
					typeAhead: false,
					listeners: {
						select: function (combo, rec) {
							var proxy = unitsStore.getProxy();
							Ext.apply(proxy.extraParams, {
								property_id: rec[0].get('property_id')
							});
							unitsStore.load();

							proxy = unitTypesStore.getProxy();
							Ext.apply(proxy.extraParams, {
								property_id: rec[0].get('property_id')
							});
							unitTypesStore.load();

							proxy = glAccountsStore.getProxy();
							Ext.apply(proxy.extraParams, {
								property_id: rec[0].get('property_id'),
								vendorsite_id: that.vendorsite_id
							});
							glAccountsStore.load();
						}
					},
					selectFirstRecord: true
				}
			},
			{
				text: NP.Translator.translate('Unit'),
				flex: 1,
				dataIndex: 'unit_number',
				editor:
				{
					xtype: 'customcombo',
					store: unitsStore,
					queryMode: 'local',
					editable: false,
					typeAhead: false,
					displayField: 'unit_number',
					valueField: 'unit_number',
					selectFirstRecord: true
				}
			},
			{
				text: NP.Translator.translate('Unit type'),
				flex: 1,
				dataIndex: 'unittype_name',
				editor:
				{
					xtype: 'customcombo',
					store: unitTypesStore,
					queryMode: 'local',
					editable: false,
					typeAhead: false,
					displayField: 'unittype_name',
					valueField: 'unittype_name',
					selectFirstRecord: true,
					listeners: {
						select: function(combo, rec) {
//							console.log(rec);
						}
					},
					tpl: [
						'<tpl for=".">',
						'<div class="x-boundlist-item">{unittype_name}</div>',
						'</tpl>'
					]
				}
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
				dataIndex: 'vcitem_uom',
				text: NP.Translator.translate('UOM'),
				flex: 0.2
			},
			{
				text: NP.Translator.translate('Taxable'),
				flex: 0.3,
				align: 'center',
				renderer: function (val, meta, record) {
					return Ext.String.format('<input name="taxable_' + record.get('vc_id') + '[]" type="checkbox" value="{0}">',record.get('vcorder_id'));
				}
			},
			{
				text: NP.Translator.translate('Gl Code'),
				flex: 2,
				dataIndex: 'glaccount_name',
				editor:
				{
					xtype: 'customcombo',
					store: glAccountsStore,
					displayField: 'glaccount_name',
					valueField: 'glaccount_name',
					queryMode: 'local',
					editable: false,
					typeAhead: false
				}
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
	},

	setVendorsiteId: function(vendorsite_id) {
		this.vendorsite_id = vendorsite_id;
	}
});