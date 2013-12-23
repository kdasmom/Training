/**
 * Created by Andrey Baranov
 * date: 12/19/13 5:01 PM
 */

Ext.define('NP.view.catalog.ItemsFilter', {
	extend: 'Ext.container.Container',
	alias: 'widget.catalog.itemsfilter',

	requires: [],
	layout: 'vbox',

	initComponent: function() {
		var me = this;

		console.log(me.vc_id, me.filterField, me.filterValue);

		this.items = [
			{
				xtype: 'displayfield',
				name: 'selectedItems',
				fieldLabel: NP.Translator.translate('YOU HAVE SELECTED'),
				labelAlign: 'top',
				value: '<div style="padding: 0px 0px 0px 15px;">' + me.category + ' <a href="javascript: void(0)">x</a></div>'
			},
			{
				xtype: 'fieldcontainer',
				fieldLabel: NP.Translator.translate('CONTINUE NARROWING BY'),
				labelAlign: 'top',
				layout: 'vbox',
				items: [
					{
						xtype: 'displayfield',
						name: 'typeslabel',
						fieldLabel: NP.Translator.translate('Type'),
						value: '',
						labelAlign: 'top'
					},
					{
						xtype: 'dataview',
						tpl: new Ext.XTemplate(
							'<tpl for=".">',
							'<div style="margin-bottom: 10px; float: left; width: 50%; padding: 10px; cursor: pointer;" class="type">',
							'<span>{vcitem_type} <a href="javascript: void(0)" class="remove">x</a></span>',
							'</div>',
							'</tpl>'
						),
						itemSelector: 'div.type',
						width: 400,
						store: Ext.create('NP.lib.data.Store', {
							fields: ['vcitem_type'],
							autoLoad : true,
							service: 'CatalogService',
							action: 'getItemsTypesByCategoryOrBrands',
							extraParams: {
								userprofile_id: NP.Security.getUser().get('userprofile_id'),
								catalogs: me.vc_id,
								field: me.filterField,
								value: me.filterValue
							}
						}),
						listeners: {
							itemclick: function (dataview, record, item, index, e, eOpts) {
								this.hide();
								me.down('[name="typeslabel"]').hide();
								me.fireEvent('removetype', record.get('vcitem_type'));
								me.down('[name="selectedItems"]').setValue('<div style="padding: 0px 0px 0px 15px;">' + record.get('vcitem_type') + ' <a href="javascript: void(0)">x</a></div>');
							}
						}
					},
					{
						xtype: 'displayfield',
						fieldLabel: NP.Translator.translate('Price'),
						value: '',
						labelAlign: 'top'
					},
					{
						xtype: 'dataview',
						padding: '0 0 0 15',
						tpl: new Ext.XTemplate(
							'<tpl for=".">',
							'<div style="margin-bottom: 10px; cursor: pointer;" class="price">',
							'<span>{price}</span>',
							'</div>',
							'</tpl>'
						),
						store: Ext.create('Ext.data.ArrayStore', {
							fields: ['price'],
							autoLoad : true,
							data: [
								[NP.Translator.translate('Under $25')],
								[NP.Translator.translate('$25 - $50')],
								[NP.Translator.translate('$50 - $75')],
								[NP.Translator.translate('$75 - $100')],
								[NP.Translator.translate('Over $100')]
							]
						}),
						itemSelector: 'div.price'
					}
				]
			}
		];

		this.callParent(arguments);
	}
});