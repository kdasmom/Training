/**
 * Created by Andrey Baranov
 * date: 12/5/13 12:42 PM
 */

Ext.define('NP.view.catalog.OrderPropertiesForm', {
	extend: 'Ext.container.Container',
	alias: 'widget.catalog.orderpropertiesform',

	requires: [
		'NP.lib.core.Translator'
	],

	layout: 'vbox',
	property_id: null,

	initComponent: function() {
		var that = this;
		this.defaults = {
			labelWidth: 200,
			width: 600
		};

		this.items = [
			{
				xtype: 'customcombo',
				name: 'property_id',
				displayField: 'property_name',
				valueField: 'property_id',
				fieldLabel: NP.Translator.translate('Header Property'),
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
				queryMode: 'local',
				editable: false,
				typeAhead: false,
				listeners: {
					select: function(combo, rec) {
						that.property_id = combo.getValue();
						that.fireEvent('selectProperty', combo, rec, that.vc_id, that.vcorders);
					}
				}
			},
			{
				xtype: 'customcombo',
				id: 'vendor_id',
				name: 'vendor_id',
				displayField: 'vendor_name',
				valueField: 'vendorsite_id',
				fieldLabel: NP.Translator.translate('Vendor'),
				queryMode: 'local',
				editable: false,
				typeAhead: false,
				listeners: {
					select: function(combo, value) {
						that.fireEvent('selectVendor', combo, value, that.property_id)
					}
				},
				selectFirstRecord: true
			},
			{
				xtype: 'customcombo',
				id: 'purchaseorder_id',
				fieldLabel: NP.Translator.translate('PO'),
				queryMode: 'local',
				editable: false,
				typeAhead: false
			}
		];

		this.callParent(arguments);
	}
});