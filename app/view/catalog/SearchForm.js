/**
 * Created by Andrey Baranov
 * date: 11/26/13 5:27 PM
 */


Ext.define('NP.view.catalog.SearchForm', {
	extend: 'Ext.container.Container',
	alias: 'widget.catalog.searchform',

	requires: [
		'NP.lib.core.Translator'
	],

	layout: 'hbox',

	initComponent: function() {
		var that = this;

		var searchOptions = [
			{

			}
		];

		this.items = [
			{
				xtype: 'customcombo',
				name: 'vccat_id',
				id: 'vccat_id',
				labelWidth: !this.advancedSearch ? 60 : 120,
				displayField: 'vc_catalogname',
				valueField: 'vc_id',
				fieldLabel: !that.advancedSearch ? NP.Translator.translate('Search') : NP.Translator.translate('Advanced Search'),
				store: Ext.create('NP.store.catalog.Vc', {
					service: 'CatalogService',
					action: 'getCatalogs',
					extraParams: {
						catalogType: 'excel'
					},
					autoLoad: true
				}),
				addBlankRecord: !that.advancedSearch ? true : false,
				multiSelect: !that.advancedSearch ? false : true,
				queryMode: 'local',
				editable: false,
				typeAhead: false,
				width: !that.advancedSearch ? 300 : 360
			},
			{
				xtype: 'customcombo',
				name: 'item_name',
				id: 'item_name',
				fieldLabel: NP.Translator.translate('by'),
				labelWidth: 20,
				queryMode: 'local',
				editable: false,
				typeAhead: false,
				selectFirstRecord: true,
				margin: '0 0 0 5',
				valueField: 'value',
				displayField: 'display',
				store: Ext.create('Ext.data.ArrayStore', {
					fields: ['value', 'display'],
					autoLoad : true,
					data: [
						["any", NP.Translator.translate('Any')],
						["category", NP.Translator.translate('Category')],
						["itemType", NP.Translator.translate('Item Type')],
						["vcitem_number", NP.Translator.translate('Item Number')],
						["vcitem_desc", NP.Translator.translate('Item Description')],
						["brand", NP.Translator.translate('Brand')],
						["upc", NP.Translator.translate('UPC Code')]
					]
				})
			},
			{
				xtype           : 'customcombo',
				name            : 'property_id',
				id            	: 'property_id',
				displayField    : 'property_name',
				valueField      : 'property_id',
				store           : 'user.Properties',
				labelWidth: 60,
				fieldLabel:NP.Translator.translate('Property'),
				queryMode: 'local',
				width: 300,
				editable: false,
				typeAhead: false,
				margin: '0 0 0 5',
				selectFirstRecord: true
			},
			{
				xtype: 'textfield',
				name: 'keyword',
				id: 'keyword',
				margin: '0 0 0 5'
			},
			{
				xtype: 'button',
				text: NP.Translator.translate('Search'),
				margin: '0 0 0 10',
				handler: function() {
					if (that.getChildByElement('keyword').getValue().length == 0) {
						Ext.Msg.alert('Error', 'You must enter a search term.');
					} else {
						if (that.advancedSearch) {
							that.fireEvent('advancedsearch', that.getChildByElement('vccat_id').getValue(), that.getChildByElement('item_name').getValue(),that.getChildByElement('property_id').getValue(),that.getChildByElement('keyword').getValue());
						} else {
							that.fireEvent('searchitems', that.getChildByElement('vccat_id').getValue(), that.getChildByElement('item_name').getValue(),that.getChildByElement('property_id').getValue(),that.getChildByElement('keyword').getValue(), that.advancedSearch ? that.advancedSearch : false);
						}
					}
				}
			}
		];

		this.callParent(arguments);
	}
});