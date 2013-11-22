/**
 * Created by rnixx on 10/31/13.
 */


Ext.define('NP.view.vendor.AlternativeAddresses', {
	extend: 'Ext.container.Container',
	alias: 'widget.vendor.alternativeaddresses',

	requires: [
		'NP.lib.core.Security',
		'NP.lib.ui.ComboBox',
		'NP.lib.ui.Grid',
		'NP.lib.core.Translator'
	],

	padding: 8,

	// For localization
	title                     : NP.Translator.translate('Alternative addresses'),
	vendor_id: null,

	initComponent: function() {
		var that = this;

		this.items = [
			{
				xtype: 'customgrid',
				title: NP.Translator.translate('Alternate addresses'),
				store: Ext.create('NP.store.contact.Addresses', {
					service : 'VendorService',
					action  : 'findAlternateAddresses',
					extraParams: {
						vendor_id: that.vendor_id
					},
					extraFields: ['country_name'],
					autoLoad: true
				}),
				columns: [
					{
						text: NP.Translator.translate('ID'),
						dataIntex: 'address_id_alt',
						width: 120,
						renderer: function(val, meta, rec) {
							return rec.get('address_id_alt');
						}
					},
					{
						text: NP.Translator.translate('Address'),
						flex: 1,
						dataIndex: 'fullAddress',
						renderer: function(val, meta, rec) {
							return rec.get('address_line1') + ' ' +
								(rec.get('address_line2') !== null ? ', ' + rec.get('address_line2') : '') +
								(rec.get('address_city') ? ', ' + rec.get('address_city') : '') +
								(rec.get('address_state') ? ', ' + rec.get('address_state') : '') +
								(rec.get('address_zip') ? ', ' + rec.get('address_zip') : '') +
								(rec.get('address_zipext') ? ', ' + rec.get('address_zipext') : '') +
								(rec.get('address_country') ? ', ' + rec.get('address_country') : '') +
								(rec.get('country_name') ? ', ' + rec.get('country_name') : '');
						}
					}
				],
				border:  false
			}
		];

		this.callParent(arguments);
	}
});