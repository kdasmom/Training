/**
 * Created by rnixx on 11/26/13.
 */


Ext.define('NP.view.catalog.VCGrid', {
	extend: 'NP.lib.ui.Grid',
	alias : 'widget.catalog.vcgrid',

	requires: [
		'NP.view.catalog.gridcol.VcItemCategory'
	],

	paging: true,

	initComponent: function() {

		this.columns = [
			{
				xtype: 'catalog.gridcol.vcitemcategory'
			},
			{
				dataIndex: "catalogs",
				text: NP.Translator.translate('Catalog')
			}
		];

		this.store = Ext.create('NP.store.catalog.Vc', {
			service    : 'CatalogService',
			action     : 'getRegister',
			paging     : true,
			extraParams: { vc_status: this.vc_status }
		});

		this.callParent(arguments);
	}

});