/**
 * Created by Andrey Baranov
 * date: 11/26/13 5:27 PM
 */


Ext.define('NP.view.catalog.SearchForm', {
	extend: 'Ext.container.Container',
	alias: 'widget.catalog.searchform',

	requires: [
		'NP.lib.core.Translator',
		'NP.lib.ui.ListPicker',
		'Ext.layout.container.Column'
	],

	layout: 'column',

	initComponent: function() {
		var that     = this,
			catStore = {
				type: 'catalog.vc',
				service: 'CatalogService',
				action: 'getCatalogs',
				extraParams: {
					catalogType: 'excel'
				},
				autoLoad: true,
				listeners: {
					load: function() {
						if (that.vc_id && !that.advancedSearch) {
							that.down('[name="vccat_id"]').setValue( parseInt(that.vc_id) );
						}
					}
				}
			},
			catPicker = {
				name        : 'vccat_id',
				id          : 'vccat_id',
				labelWidth  : 120,
				displayField: 'vc_catalogname',
				valueField  : 'vc_id',
				store       : catStore,
				margin      : '0 0 5 0'
			};

		this.margin = that.advancedSearch ? '18px 0 0 0' : '0';

		if (that.advancedSearch) {
			Ext.apply(catPicker, {
				xtype       : 'listpicker',
				title       : '',
				labelWidth  : 120,
				fieldLabel  : NP.Translator.translate('Advanced Search'),
				width       : 360
			});
		} else {
			Ext.apply(catPicker, {
				xtype       : 'customcombo',
				labelWidth  : 60,
				fieldLabel  : NP.Translator.translate('Search'),
				emptyText   : NP.Translator.translate('All Catalogs'),
				width       : 300
			});
		}

		this.items = [
			catPicker,
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
				margin: '0 0 5 5',
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
				store           : Ext.create('NP.store.property.Properties', {
					service: 'PropertyService',
					action: 'getAll',
					autoLoad: true
				}),
				addBlankRecord: true,
				blankRecordDisplayValue: NP.Translator.translate('Any'),
				labelWidth: 60,
				matchFieldWidth: false,
				fieldLabel:NP.Translator.translate('Property'),
				queryMode: 'local',
				width: 300,
				editable: false,
				typeAhead: false,
				margin: '0 0 5 5',
				emptyText: 'Any'
			},
			{
				xtype: 'textfield',
				name: 'keyword',
				id: 'keyword',
				margin: '0 0 5 5',
				width: 195,
				enableKeyEvents: true,
				listeners: {
					keypress: function(form, e) {
						if (e.getKey() === Ext.EventObject.ENTER) {
							that.submitSearchForm()
						}
					}
				}
			},
			{
				xtype: 'button',
				text: NP.Translator.translate('Search'),
				margin: '0 0 5 10',
				handler: function() {
					that.submitSearchForm()
				}
			}
		];

		this.callParent(arguments);
	},

	submitSearchForm: function() {
		var that = this;

		if (that.getChildByElement('keyword').getValue().length == 0) {
			Ext.Msg.alert('Error', 'You must enter a search term.');
		} else {
			if (that.advancedSearch) {
				that.fireEvent(
					'advancedsearch',
					!that.getChildByElement('vccat_id').getValue() ? '' : that.getChildByElement('vccat_id').getValue(),
					that.getChildByElement('item_name').getValue(),
					!that.getChildByElement('property_id').getValue() ? '' : that.getChildByElement('property_id').getValue(),
					that.getChildByElement('keyword').getValue()
				);
			} else {
				that.fireEvent(
					'searchitems',
					!that.getChildByElement('vccat_id').getValue() ? '' : that.getChildByElement('vccat_id').getValue(),
					that.getChildByElement('item_name').getValue(),
					!that.getChildByElement('property_id').getValue() ? '' : that.getChildByElement('property_id').getValue(),
					that.getChildByElement('keyword').getValue(),
					that.advancedSearch ? that.advancedSearch : false
				);
			}
		}
	}
});