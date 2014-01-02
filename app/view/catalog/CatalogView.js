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
		'NP.view.shared.button.Shop',
		'NP.view.shared.button.Back',
		'NP.view.shared.button.Search',
		'NP.view.shared.button.Favorite',
		'NP.view.catalog.TopBar',
		'NP.view.catalog.CategoriesDataView',
		'NP.view.catalog.BrandsDataView'
	],

	property_id: null,

	layout: {
		type : 'vbox',
		align: 'stretch'
	},

	initComponent: function() {
		var me = this;

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
		me.autoScroll = true;

		me.items = [
			{
				xtype         : 'catalog.topbar',
				advancedSearch: me.advancedSearch
			},
			{
				xtype: 'catalog.categoriesdataview',
				name: 'categoriesview',
				vc_id: me.vc_id,
				hidden: me.catalog.vc_catalogtype !== 'excel'
			},
			{
				xtype: 'catalog.brandsdataview',
				name: 'brandsview',
				vc_id: me.vc_id,
				padding: '20 0 0 0',
				hidden: me.catalog.vc_catalogtype !== 'excel'
			},
			{
				xtype: 'component',
				name: 'iframeUrl',
				height: '100%',
				layout: 'fit',
				align: 'center',
				autoEl: {
					tag : "iframe",
					src: me.catalog.vc_catalogtype !== 'url' ? '' : me.catalog.vc_url,
					width: '100%'
				},
				hidden: me.catalog.vc_catalogtype !== 'url',
				flex: 1
			},
			{
				xtype: 'component',
				height: '100%',
				name: 'iframePdf',
				layout: 'fit',
				align: 'center',
				autoEl: {
					tag : "iframe",
					src: me.catalog.vc_catalogtype !== 'pdf' ? '' : 'clients/' + NP.lib.core.Config.getAppName() + '/web/exim_uploads/catalog/vc_' + me.vc_id + '.pdf',
					width: '100%'
				},
				hidden: me.catalog.vc_catalogtype !== 'pdf',
				flex: 1
			},
			{
				xtype: 'panel',
				layout: 'fit',
				align: 'center',
				name: 'panelPunchout',
				height: '100%',
				hidden: me.catalog.vc_catalogtype !== 'punchout',
				flex: 1,
				tbar: [
					{
						xtype       : 'customcombo',
						name        : 'userPropertyCombo',
						store       : 'user.Properties',
						displayField: 'property_name',
						valueField  : 'property_id',
						fieldLabel  : NP.Translator.translate('Property'),
						value       : NP.Security.getCurrentContext().property_id,
						listeners   : {
							select: me.onSelectProperty.bind(me)
						},
						width: 300
					}
				],
				items: [
					{
						xtype: 'component',
						itemId: 'punchoutiframe',
						width: '100%',
						flex: 1,
						autoEl: {
							tag: 'iframe',
							src: '',
							width: '100%'
						}
					}
				]
			}
		];

		me.callParent(arguments);

		if (me.catalog.vc_catalogtype === 'punchout') {
			me.on('render', me.onSelectProperty.bind(me));
		}
	},

	onSelectProperty: function() {
		var me            = this,
			propertyCombo = me.down('[name="userPropertyCombo"]'),
			property_id   = propertyCombo.getValue(),
			context       = NP.Security.getCurrentContext();

		if (me.property_id !== property_id) {
			me.reloadIframe(property_id, me.vc_id);
			me.property_id = property_id;
			NP.Security.setCurrentContext(Ext.apply(context, {
				property_id: property_id
			}));
		}
	},

	reloadIframe: function (property_id, vc_id) {
		var me = this;
		var mask = new Ext.LoadMask({target: me});
		mask.show();

		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'CatalogService',
				action : 'getPunchoutUrl',
				vc_id: parseInt(vc_id),
				property_id: property_id,
				userprofile_id: NP.Security.getUser().get('userprofile_id'),
				success: function(success) {
					var iframe = me.down('#punchoutiframe');
					mask.destroy();
					if (!success.success) {
						Ext.MessageBox.alert('Error', 'NexusPayables is unable to connect to this vendor at this time. Please try again. If the problem persists, report it to your system administrator for resolution.');
					} else {
						iframe.el.dom.src = success.url;
					}
				}
			}
		});
	}
});
