/**
 * Created by Andrey Baranov
 * date: 12/17/13 4:25 PM
 */


Ext.define('NP.view.catalog.BrandsView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.brandsview',

	requires: [
		'NP.lib.core.Config',
		'NP.view.shared.button.Shop',
		'NP.view.shared.button.Search',
		'NP.view.shared.button.Favorite',
		'NP.view.catalog.JumpToCatalogForm',
		'NP.view.catalog.SearchForm',
		'NP.view.catalog.UserOrder',
		'NP.view.catalog.AlphabeticalBrandsGrid'
	],

	title: NP.Translator.translate('Shop By Brand'),

	initComponent: function() {
		var that = this;
		var bar = [
			{
				xtype: 'shared.button.back',
				text: NP.Translator.translate('Catalog home')
			},
			{
				xtype: 'shared.button.search',
				text: NP.Translator.translate('Advanced search')
			},
			{
				xtype: 'shared.button.favorite'
			}
		];

		var alphabet = ['0-9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		var objs = [];
		for (var i = 0; i < alphabet.length; i++) {

			(function(index, text) {
				objs[index] = {
					text: text,
					listeners:
					{
						click:
						{
							fn: function()
							{
								that.fireEvent('focusonletter',text);
							}
						}
					}
			};
			})(i, alphabet[i]);
		}
		this.tbar = bar;
		this.overflowY = 'scroll';

		this.items = [
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [
					{
						xtype: 'catalog.jumptocatalogform',
						flex: 0.8
					},
					{
						xtype: 'catalog.userorder',
						align: 'right',
						flex: 0.2
					}
				],
				padding: '5',
				border: false
			},
			{
				xtype: 'panel',
				items: [
					{
						xtype: 'catalog.searchform'
					}
				],
				padding: '5',
				border: false
			},
			{
				xtype: 'buttongroup',
				width: '100%',
				items: objs
			},
			{
				xtype: 'catalog.alphabeticalbrandsgrid'
			}
		];

		this.callParent(arguments);
	}
});