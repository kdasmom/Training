/**
 * Created by rnixx on 11/26/13.
 */


Ext.define('NP.view.catalog.VCGrid', {
	extend: 'NP.lib.ui.Grid',
	alias : 'widget.catalog.vcgrid',

	requires: [
		'NP.view.catalog.gridcol.VcCatalogCategory'
	],

	paging: true,
	overflowY: 'scroll',

	initComponent: function() {

		this.columns = [
			{
				dataIndex: "vc_catalogname",
				text: NP.Translator.translate('Vendor Catalog Categories'),
				flex: 1,
				renderer: function (val, meta, rec) {
					if (rec.getVc) {
						return rec.getVc().get('vc_catalogname');
					}

					return val;
				}
			}
		];

		this.store = Ext.create('NP.store.catalog.LinkVcVcCats', {
			service    	: 'CatalogService',
			action     	: 'getCategoriesList',
			groupField	: 'vccat_name',
			extraParams: {
				userprofile_id: NP.Security.getUser().get('userprofile_id')
			},
			paging     	: true,
			autoLoad	: true
		});

		this.features = [{
			ftype: 'grouping',
			groupHeaderTpl: Ext.create('Ext.XTemplate',
				'<img src="/files/categories/vc_cat_{name:this.formatName}.jpg"/> {name}',
				{
					formatName: function(name) {
						return name.replace(/ /gi,'_');
					}
				}
			)
		}];

		this.callParent(arguments);
	}

});