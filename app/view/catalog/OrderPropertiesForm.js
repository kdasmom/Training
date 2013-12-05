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

	initComponent: function() {
		var that = this;
		this.defaults = {
			labelWidth: 200,
			width: 600
		};

		console.log('vc_id22: ', this.vc_id);

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
						console.log('value: ', rec);
						console.log(rec[0].get('property_id'));

						that.getChildByElement('purchaseorder_id').store = Ext.create('NP.store.property.Properties', {
							service: 'CatalogService',
							action: 'getUserPOs',
							extraParams: {
								vc_id: that.vc_id,
								property_id: rec[0].get('property_id')
							},
							autoLoad: true
						});
					}
				}
			},
			{
				xtype: 'displayfield',
				id: 'vendor_name',
				fieldLabel: NP.Translator.translate('Vendor'),
				value: ''
			},
			{
				xtype: 'customcombo',
				id: 'purchaseorder_id',
				fieldLabel: NP.Translator.translate('PO'),
				queryMode: 'local',
				editable: false,
				typeAhead: false,
				store: []
			}
		];

		this.callParent(arguments);
	}
});