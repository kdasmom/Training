/**
 * Created by Andrey Baranov
 * date: 12/19/13 7:45 AM
 */

Ext.define('NP.view.catalog.AlphabeticalBrandsGrid', {
	extend: 'NP.lib.ui.Grid',
	alias : 'widget.catalog.alphabeticalbrandsgrid',

	requires: [
		'NP.lib.core.Util'
	],

	overflowY: 'scroll',

	initComponent: function() {
		var that = this;
		var grouping = Ext.create('Ext.grid.feature.Grouping', {
			groupHeaderTpl: '{name}',
			collapsible: true,
			startCollapsed: true
		});
		this.features = [grouping];

		this.columns = [
			{
				dataIndex: 'vcitem_manufacturer',
				text: NP.Translator.translate('Brand'),
				flex: 1,
				padding: '0 0 0 10'
			}
		];

		this.store = Ext.create('NP.lib.data.Store', {
			service    	: 'CatalogService',
			action     	: 'getBrands',
			groupField	: 'letter',
			autoLoad	: true,
			fields: ['vcitem_manufacturer', 'letter']
		});
		this.callParent(arguments);
	}
});