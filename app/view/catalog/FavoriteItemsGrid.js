/**
 * Created by Andrey Baranov
 * date: 12/12/13 4:26 PM
 */


Ext.define('NP.view.catalog.FavoriteItemsGrid', {
	extend: 'NP.lib.ui.Grid',
	alias : 'widget.catalog.favoriteitemsgrid',

	requires: [
		'NP.lib.core.Util'
	],

	paging: true,
	overflowY: 'scroll',

	initComponent: function() {
		var that = this;

		this.columns = [
			{
				text: NP.Translator.translate('Favorites'),
				flex: 0.2
			},
			{
				text: NP.Translator.translate('Item number'),
				flex: 0.2
			},
			{
				text: NP.Translator.translate('Item description'),
				flex: 0.5
			},
			{
				text: NP.Translator.translate('Item detail'),
				flex: 0.2
			},
			{
				text: NP.Translator.translate('Item price'),
				flex: 0.2
			},
			{
				text: NP.Translator.translate('Unit of Measurement'),
				flex: 0.2
			},
			{
				text: NP.Translator.translate('Qty'),
				flex: 0.2
			},
			{
				text: NP.Translator.translate('Append to order'),
				flex: 0.2
			}
		];

		this.store = [];


		this.callParent(arguments);
	}
});