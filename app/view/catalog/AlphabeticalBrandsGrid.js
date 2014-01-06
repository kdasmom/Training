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

	padding: false,
	stateful: true,
	autoScroll: true,
	stateId : 'brands_grid',

	initComponent: function() {
		var that = this;
		var grouping = Ext.create('Ext.grid.feature.Grouping', {
			groupHeaderTpl:  '<div style="height: 15px;"><div style="float: left;">{name}</div><div style="float: right; margin-right: 20px;"><a href="javascript:void(0)" class="top">Return to top</a></div></div>',
			collapsible: false
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
			fields: ['vcitem_manufacturer', 'letter', 'vc_id']
		});


		this.listeners = {
			groupclick: function (view, node, group, e, eOpts) {
				var link = Ext.fly(e.target);

				if (link.hasCls('top')) {
					that.getView().focusRow(0);
				}
			}
		};
		this.callParent(arguments);
	}
});