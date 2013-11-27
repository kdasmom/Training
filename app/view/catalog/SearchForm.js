/**
 * Created by Andrey Baranov
 * date: 11/26/13 5:27 PM
 */


Ext.define('NP.view.catalog.SearchForm', {
	extend: 'Ext.container.Container',
	alias: 'widget.catalog.searchform',

	requires: [],
	layout: 'hbox',

	initComponent: function() {
		var that = this;

		this.items = [
			{
				xtype: 'customcombo',
				name: 'catalog_name',
				labelWidth: 60,
				fieldLabel: NP.Translator.translate('Search'),
				store: [],
				queryMode: 'local',
				editable: false,
				typeAhead: false,
				width: 300
			},
			{
				xtype: 'customcombo',
				name: 'item_name',
				fieldLabel: NP.Translator.translate('by'),
				labelWidth: 20,
				store: [],
				queryMode: 'local',
				editable: false,
				typeAhead: false,
				margin: '0 0 0 5'
			},
			{
				xtype: 'customcombo',
				name: 'property_name',
				fieldLabel: NP.Translator.translate('by'),
				labelWidth: 60,
				store: [],
				fieldLabel:NP.Translator.translate('Property'),
				queryMode: 'local',
				editable: false,
				typeAhead: false,
				margin: '0 0 0 5'
			},
			{
				xtype: 'textfield',
				name: 'keyword',
				margin: '0 0 0 5'
			},
			{
				xtype: 'button',
				text: NP.Translator.translate('Search'),
				margin: '0 0 0 10'
			}
		];

		this.callParent(arguments);
	}
});