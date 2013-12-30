/**
 * Created by Andrey Baranov
 * date: 11/29/13 5:14 PM
 */

Ext.define('NP.view.catalog.CatalogView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.catalogview',

	requires: [
		'NP.lib.core.Config',
		'NP.view.shared.button.Shop',
		'NP.view.shared.button.Back',
		'NP.view.shared.button.Search',
		'NP.view.shared.button.Favorite',
		'NP.view.catalog.JumpToCatalogForm',
		'NP.view.catalog.UserOrder',
		'NP.view.catalog.SearchForm',
		'NP.view.catalog.CategoriesDataView',
		'NP.view.catalog.BrandsDataView'
	],

	property_id: null,

	initComponent: function() {
		var that = this;

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

		this.tbar = bar;
		this.autoScroll = true;
		console.log(that.catalog.vc_catalogtype);

		this.items = [
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [
					{
						xtype: 'catalog.jumptocatalogform',
						flex: 0.8
					},
					{
						xtype: 'catalog.userorder',
						align: 'right',
						flex: 0.2
					}
				],
				padding: '5',
				border: false
			},
			{
				xtype: 'panel',
				items: [
					{
						xtype: 'catalog.searchform',
						advancedSearch: that.advancedSearch
					}
				],
				padding: '5',
				border: false
			},
			{
				xtype: 'catalog.categoriesdataview',
				name: 'categoriesview',
				vc_id: that.vc_id,
				overflowY: 'scroll',
				hidden: that.catalog.vc_catalogtype !== 'excel'
			},
			{
				xtype: 'catalog.brandsdataview',
				name: 'brandsview',
				vc_id: that.vc_id,
				padding: '20 0 0 0',
				overflowY: 'scroll',
				hidden: that.catalog.vc_catalogtype !== 'excel'
			},
			{
				xtype: 'component',
				name: 'iframeUrl',
				height: '100%',
				layout: 'fit',
				align: 'center',
				autoEl: {
					tag : "iframe",
					src: that.catalog.vc_url,
					width: '100%'
				},
				hidden: that.catalog.vc_catalogtype !== 'url'
			},
			{
				xtype: 'component',
				height: '100%',
				name: 'iframePdf',
				layout: 'fit',
				align: 'center',
				autoEl: {
					tag : "iframe",
					src: 'clients/' + NP.lib.core.Config.getAppName() + '/web/exim_uploads/catalog/pdf/' + that.vc_id + '.pdf',
					width: '100%'
				},
				hidden: that.catalog.vc_catalogtype !== 'pdf'
			},
			{
				xtype: 'panel',
				layout: 'fit',
				align: 'center',
				name: 'panelPunchout',
				height: '100%',
				hidden: that.catalog.vc_catalogtype !== 'punchout',
				tbar: [
					{
						xtype: 'customcombo',
						name: 'userPropertyCombo',
						store: 'user.Properties',
						displayField: 'property_name',
						valueField: 'vc_id',
						queryMode: 'local',
						editable: false,
						typeAhead: false,
						fieldLabel: NP.Translator.translate('Property'),
						listeners: {
							select: function (combo, records, eOpts) {
								var value;
								if ( records.length > 0) {
									value = records[0].get('property_id');
								} else {
									value = records.get('property_id');
								}
								combo.getStore().reload();
								if (that.property_id !== value) {
									that.reloadIframe(value, that.vc_id);
									that.property_id = value;
								}
							}
						},
						width: 300
					}
				],
				items: [
					{
						xtype: 'component',
						name: 'punchoutiframe',
						padding: '10',
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

		/*if (that.catalog.vc_catalogtype == 'excel') {
			this.items.push({
				xtype: 'catalog.categoriesdataview',
				vc_id: that.vc_id,
				overflowY: 'scroll'
			});
			this.items.push({
				xtype: 'catalog.brandsdataview',
				vc_id: that.vc_id,
				padding: '20 0 0 0',
				overflowY: 'scroll'
			});
		}

		if (that.catalog.vc_catalogtype == 'url') {
			that.items.push({
				xtype: 'component',
				height: '100%',
				layout: 'fit',
				align: 'center',
				autoEl: {
					tag : "iframe",
					src: that.catalog.vc_url,
					width: '100%'
				}
			});
		}
		if (that.catalog.vc_catalogtype == 'pdf') {
			that.items.push({
				xtype: 'component',
				height: '100%',
				layout: 'fit',
				align: 'center',
				autoEl: {
					tag : "iframe",
					src: 'clients/' + NP.lib.core.Config.getAppName() + '/web/exim_uploads/catalog/pdf/' + that.vc_id + '.pdf',
					width: '100%'
				}
			});
		}

		if (that.catalog.vc_catalogtype == 'punchout') {
			that.items.push(
				{
					xtype: 'panel',
					layout: 'fit',
					align: 'center',
					height: '100%',
					tbar: [
						{
							xtype: 'customcombo',
							name: 'userPropertyCombo',
							store: 'user.Properties',
							displayField: 'property_name',
							valueField: 'vc_id',
							queryMode: 'local',
							editable: false,
							typeAhead: false,
							fieldLabel: NP.Translator.translate('Property'),
							listeners: {
								select: function (combo, records, eOpts) {
									var value;
									if ( records.length > 0) {
										value = records[0].get('property_id');
									} else {
										value = records.get('property_id');
									}
									combo.getStore().reload();
									if (that.property_id !== value) {
										that.reloadIframe(value, that.vc_id);
										that.property_id = value;
									}
								}
							},
							width: 300
						}
					],
					items: [
						{
							xtype: 'component',
							name: 'punchoutiframe',
							padding: '10',
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
			);
		}*/

		this.callParent(arguments);
	},

	reloadIframe: function (property_id, vc_id) {
		var me = this;

		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'CatalogService',
				action : 'getPunchoutUrl',
				vc_id: parseInt(vc_id),
				property_id: property_id,
				userprofile_id: NP.Security.getUser().get('userprofile_id'),
				success: function(success) {
					var iframe = me.down('[name="punchoutiframe"]');
					if (!success.success) {
						Ext.MessageBox.alert('Error', 'NexusPayables is unable to connect to this vendor at this time. Please try again. If the problem persists, report it to your system administrator for resolution.');
					} else {
						iframe.autoEl.src = success.url;
					}
				}
			}
		});
	}
});
