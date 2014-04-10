/**
 * Created by rnixx on 11/26/13.
 */


Ext.define('NP.view.catalog.VCGrid', {
	extend: 'NP.lib.ui.Grid',
	alias : 'widget.catalog.vcgrid',

	requires: [
		'NP.view.catalog.gridcol.VcCatalogCategory'
	],

	paging: false,
	border: false,

	initComponent: function() {
		var me = this;

		this.columns = [
			{
				dataIndex: "vc_catalogname",
				flex: 1,
				renderer: function (val, meta, rec) {
					if (rec.getVc) {
						return rec.getVc().get('vc_catalogname');
					}

					return val;
				}
			}
		];

		this.features = [{
			ftype: 'grouping',
			groupHeaderTpl: Ext.create('Ext.XTemplate',
				'<img src="/files/categories/vc_cat_{name:this.formatName}.jpg"/> {name}',
				{
					formatName: function(name) {
						return name.replace(/ /gi,'_');
					}
				}
			),
			startCollapsed: true
		}];

		this.callParent(arguments);
	}

});