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
				fieldLabel: NP.Translator.translate('YOU HAVE SELECTED'),
				labelAlign: 'top'/*,
				value: '<div style="padding: 0px 0px 0px 15px;">' + me.category + ' <a href="javascript: void(0)">x</a></div>'*/
			},
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
				width: 350,
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
						name: 'itemstypesview',
						tpl: new Ext.XTemplate(
							'<tpl for=".">',
							'<div style="padding-left: 20px; margin-bottom: 10px; float: left; clear: both; width: 100%; cursor: pointer;" class="type">',
							'<span>{vcitem_type}</span>',
							'</div>',
							'</tpl>'
						),
						itemSelector: 'div.type',
						width: 350,
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
							'<span><a href="javascript: void(0)">{price}</a></span>',
							'</div>',
							'</tpl>'
						),
						store: Ext.create('Ext.data.ArrayStore', {
							fields: ['price', 'value'],
							autoLoad : true,
							data: [
								[NP.Translator.translate('Under $25'), 0],
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