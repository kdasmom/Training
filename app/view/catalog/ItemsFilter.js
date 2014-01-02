/**
 * Created by Andrey Baranov
 * date: 12/19/13 5:01 PM
 */

Ext.define('NP.view.catalog.ItemsFilter', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.itemsfilter',

	requires: [
		'NP.lib.core.Translator'
	],
	layout: 'vbox',
	border: false,
	bodyPadding: 8,
	title: 'YOU HAVE SELECTED',

	initComponent: function() {
		var me = this;

		me.title = NP.Translator.translate(me.title);

		me.itemTypeStore = Ext.create('NP.lib.data.Store', {
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
		});

		this.items = [
			{
				xtype: 'dataview',
				name: 'selectedItems',
				tpl: new Ext.XTemplate(
					'<tpl for=".">',
					'<div style="margin-bottom: 10px; float: left; clear: both; width: 100%; cursor: pointer;" class="item">',
					'<span>{title} <a href="javascript: void(0)" style="float: right;">x</a> </span>',
					'</div>',
					'</tpl>'
				),
				store: Ext.create('Ext.data.ArrayStore', {
					fields: ['type', 'title'],
					autoLoad : true,
					data: [
						['category', me.category]
					]
				}),
				width: '100%',
				padding: '0 10 0 0',
				itemSelector: 'div.item',
				listeners: {
					itemclick: function (dataview, record, item, index, e, eOpts) {
						this.getStore().remove(record);

						var count = this.getStore().getCount();
						var type = record.get('type');
						me.fireEvent('removefilter', type, count, me.vc_id);
						if (count > 0) {
							if (type == 'type') {
								me.down('[name="typeslabel"]').show();
								var store = me.down('[name="itemstypesview"]').getStore();
								Ext.apply(store.getProxy().extraParams, {
									field: vc_id,
									value: vc_id
								});
								store.reload();
								me.down('[name="itemstypesview"]').show();
							}
							if (type == 'price') {
								me.down('[name="priceslabel"]').show();
								me.down('[name="itemspricesview"]').show();
							}
						}
					}
				}
			},
			{
				xtype: 'container',
				layout: 'vbox',
				items: [
					{
						xtype : 'component',
						html  : '<b>' + NP.Translator.translate('CONTINUE NARROWING BY') + ':</b>',
						margin: '0 0 8px 0'
					},
					{
						xtype: 'dataview',
						name: 'itemstypesview',
						tpl: new Ext.XTemplate(
							'<tpl if="this.getTypeCount() &gt; 0">' +
								'<div><b>{[NP.Translator.translate("Type")]}:</b></div>' +
								'<tpl for=".">' +
								'<div style="padding-left: 20px; margin-bottom: 10px; float: left; clear: both; width: 100%; cursor: pointer;" class="type">' +
								'<span>{vcitem_type}</span>' +
								'</div>' +
								'</tpl>' +
							'</tpl>',
							{
								getTypeCount: function() {
									return me.itemTypeStore.getCount();
				                }
							}
						),
						itemSelector: 'div.type',
						flex: 1,
						store: me.itemTypeStore,
						listeners: {
							itemclick: function (dataview, record, item, index, e, eOpts) {
								var recorddel = null;
								var store = me.down('[name="selectedItems"]').getStore();

								this.hide();
								me.down('[name="typeslabel"]').hide();
								me.fireEvent('removetype', record.get('vcitem_type'));
								store.add({type: 'type', title: record.get('vcitem_type')});
								store.each(function(record){
									if (record.get('type') == 'category') {
										recorddel = record;
									}
								});
								if (recorddel) {
									store.remove(recorddel);
								}
							}
						}
					},
					{
						xtype: 'displayfield',
						name: 'priceslabel',
						fieldLabel: NP.Translator.translate('Price'),
						value: '',
						labelAlign: 'top'
					},
					{
						xtype: 'dataview',
						name: 'itemspricesview',
						padding: '0 0 0 15',
						tpl: new Ext.XTemplate(
							'<tpl for=".">',
							'<div style="margin-bottom: 10px; cursor: pointer;" class="price">',
							'<a href="javascript: void(0)">{price}</a>',
							'</div>',
							'</tpl>'
						),
						store: Ext.create('Ext.data.ArrayStore', {
							fields: ['price', 'value'],
							autoLoad : true,
							data: [
								[NP.Translator.translate('Under $25'), 1],
								[NP.Translator.translate('$25 - $50'), 25],
								[NP.Translator.translate('$50 - $75'), 50],
								[NP.Translator.translate('$75 - $100'), 75],
								[NP.Translator.translate('Over $100'), 100]
							]
						}),
						itemSelector: 'div.price',
						listeners: {
							itemclick: function (dataview, record, item, index, e, eOpts) {
								var recorddel = null;
								var store = me.down('[name="selectedItems"]').getStore();

								this.hide();
								me.down('[name="priceslabel"]').hide();
								me.fireEvent('removeprice', record.get('value'));
								store.add({type: 'price', title: record.get('price')});
							}
						}
					}
				]
			}
		];

		this.callParent(arguments);
	}
});