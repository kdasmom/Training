/**
 * Created by Andrey Baranov
 * date: 11/29/13 5:39 PM
 */


Ext.define('NP.view.catalog.SearchResultsGrid', {
	extend: 'NP.lib.ui.Grid',
	alias : 'widget.catalog.searchresultsgrid',

	requires: [],

	paging: true,
	overflowY: 'scroll',

	initComponent: function() {

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
				text: NP.Translator.translate('Unit of measurement'),
				flex: 0.2
			},
			{
				text: NP.Translator.translate('Quantity'),
				flex: 0.2
			},
			{
				text: NP.Translator.translate('Add to order'),
				flex: 0.2
			}
		];

		this.store = [];

		this.callParent(arguments);
	}

});