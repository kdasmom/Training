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

		this.items = [
			{
				xtype: 'displayfield',
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
						fieldLabel: NP.Translator.translate('Type'),
						value: '',
						labelAlign: 'top'
					},
					{
						xtype: 'dataview',
						tpl: new Ext.XTemplate(
							'<tpl for=".">',
							'<div style="margin-bottom: 10px; float: left; width: 50%; padding: 10px; cursor: pointer;" class="type">',
							'<span>{category} ({total_items})</span>',
							'</div>',
							'</tpl>'
						),
						itemSelector: 'div.type'
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