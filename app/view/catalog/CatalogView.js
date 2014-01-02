/**
 * Created by Andrey Baranov
 * date: 11/29/13 5:14 PM
 */

Ext.define('NP.view.catalog.CatalogView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.catalogview',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security',
		'NP.lib.core.Translator',
		'NP.view.shared.button.Shop',
		'NP.view.shared.button.Back',
		'NP.view.shared.button.Search',
		'NP.view.shared.button.Favorite',
		'NP.view.catalog.TopBar',
		'NP.view.catalog.CategoriesDataView',
		'NP.view.catalog.BrandsDataView',
		'NP.model.catalog.Vc'
	],

	property_id: null,

	layout: {
		type : 'vbox',
		align: 'stretch'
	},

	errorDialogTitleText: 'Error',
	showCatalogErrorText: 'Error loading catalog',

	initComponent: function() {
		var me          = this,
			type        = Ext.util.Format.capitalize(me.catalog.vc_catalogtype),
			vc          = Ext.create('NP.model.catalog.Vc', me.catalog),
			catalogImpl = Ext.create('NP.view.catalogMaintenance.types.' + type);

		var bar = [
			{
				xtype: 'shared.button.back',
				text: NP.Translator.translate('Catalog home')
			},
			{
				xtype: 'shared.button.shop',
				text: NP.Translator.translate('Shop by Brand')
			},
			{
				xtype: 'shared.button.search',
				text: NP.Translator.translate('Advanced search')
			},
			{
				xtype: 'shared.button.favorite'
			}
		];

		me.tbar = bar;

		me.items = [
			{
				xtype         : 'catalog.topbar',
				advancedSearch: me.advancedSearch
			}
		];

		me.callParent(arguments);

		if (me.catalog.vc_catalogtype != 'excel') {
			var deferredView = catalogImpl.getView(vc),
				tries        = 0;

			function setView() {
				tries++;
				if (deferredView.view) {
					deferredView.view.itemId = 'catalogViewContainer';
					deferredView.view.flex = 1;
					me.add(deferredView.view);
				} else {
					if (tries < 50) {
						Ext.defer(setView, 750, that);
					} else {
						Ext.MessageBox.alert(
                            NP.Translator.translate(that.errorDialogTitleText),
                            NP.Translator.translate(that.showCatalogErrorText)
                        );
					}
				}
			}

			// We need to call a recursive function so that we can defer
			// processing in case we have to wait on an ajax call
			setView();
		} else {
			me.add({
				xtype     : 'container',
				autoScroll: true,
				flex      : 1,
				padding   : '16px 8px',
				items     : [
					{
						xtype : 'catalog.categoriesdataview',
						name  : 'categoriesview',
						vc_id : me.vc_id,
						margin: '0 0 8px 0'
					},
					{
						xtype : 'catalog.brandsdataview',
						name  : 'brandsview',
						vc_id : me.vc_id
					}
				]
			});
		}
	}
});
