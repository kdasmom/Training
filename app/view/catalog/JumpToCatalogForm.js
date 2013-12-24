/**
 * Created by Andrey Baranov
 * date: 11/26/13 4:55 PM
 */


Ext.define('NP.view.catalog.JumpToCatalogForm', {
	extend: 'Ext.container.Container',
	alias: 'widget.catalog.jumptocatalogform',

	requires: [],
	layout: 'column',

	initComponent: function() {
		var that = this;

		this.items = [
			{
				xtype: 'customcombo',
				name: 'vccat_id',
				id: 'vc_id',
				labelWidth: 120,
				displayField: 'vc_catalogname',
				valueField: 'vc_id',
				fieldLabel: NP.Translator.translate('Jump to Catalog'),
				store: Ext.create('NP.store.catalog.Vc', {
					service: 'CatalogService',
					action: 'getCatalogs',
					autoLoad: true
				}),
				selectFirstRecord: true,
				queryMode: 'local',
				editable: false,
				typeAhead: false,
				width: 360
			},
			{
				xtype: 'button',
				name: 'jump_to_catalog',
				text: NP.Translator.translate('Go'),
				margin: '0 0 0 10'
			}
		];

		this.callParent(arguments);
	}
});