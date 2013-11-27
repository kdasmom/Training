/**
 * Created by Andrey Baranov
 * date: 11/26/13 4:55 PM
 */


Ext.define('NP.view.catalog.JumpToCatalogForm', {
	extend: 'Ext.container.Container',
	alias: 'widget.catalog.jumptocatalogform',

	requires: [],
	layout: 'hbox',

	initComponent: function() {
		var that = this;

		this.items = [
			{
				xtype: 'customcombo',
				name: 'catalog',
				labelWidth: 120,
				fieldLabel: NP.Translator.translate('Jump to Catalog'),
				store: [],
				queryMode: 'local',
				editable: false,
				typeAhead: false,
				width: 360
			},
			{
				xtype: 'button',
				text: NP.Translator.translate('Go'),
				margin: '0 0 0 10'
			}
		];

		this.callParent(arguments);
	}
});