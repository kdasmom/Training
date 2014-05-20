/**
 * Created by Andrey Baranov
 * date: 12/17/13 4:25 PM
 */


Ext.define('NP.view.catalog.BrandsView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.brandsview',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Translator',
		'NP.view.shared.button.Shop',
		'NP.view.shared.button.Search',
		'NP.view.shared.button.Favorite',
		'NP.view.catalog.TopBar',
		'NP.view.catalog.AlphabeticalBrandsGrid',
		'Ext.container.ButtonGroup'
	],

	title: 'Shop By Brand',
	autoScroll: true,

	layout: {
		type : 'vbox',
		align: 'stretch'
	},

	initComponent: function() {
		var that = this;

		that.title = NP.Translator.translate(that.title);

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
								that.fireEvent('focusonletter',text, index);
							}
						}
					}
			};
			})(i, alphabet[i]);
		}
		this.tbar = bar;

		this.items = [
			{
				xtype: 'catalog.topbar'
			},
			{
				xtype: 'buttongroup',
				width: '100%',
				items: objs
			},
			{
				xtype     : 'catalog.alphabeticalbrandsgrid',
				autoScroll: true,
				flex      : 1
			}
		];

		this.callParent(arguments);
	}
});