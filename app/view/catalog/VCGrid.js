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

	initComponent: function() {

		this.columns = [
			{
				xtype: 'catalog.gridcol.vccatalogcategory',
				flex: 0.5
			},
			{
				dataIndex: "catalogs",
				text: NP.Translator.translate('Catalog'),
				flex: 2
			}
		];

		this.store = Ext.create('NP.store.catalog.VcCats', {
			service    	: 'CatalogService',
			action     	: 'getCategoriesList',
			extraParams: {
				userprofile_id: NP.Security.getUser().get('userprofile_id')
			},
			paging     	: true,
			autoLoad	: true
		});

		this.callParent(arguments);
	}

});