/**
 * Created by Andrey Baranov
 * date: 12/2/13 3:11 PM
 */

Ext.define('NP.view.catalog.VcOrdersGrid', {
	extend: 'NP.lib.ui.Grid',
	alias : 'widget.catalog.vcordersgrid',

	requires: [],

	paging: true,
	overflowY: 'scroll',

	initComponent: function() {

		this.columns = [
			{
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
				text: NP.Translator.translate('Item to total'),
				flex: 0.2
			},
			{
				flex: 0.2
			}
		];

		this.store = [];

		this.callParent(arguments);
	}

});