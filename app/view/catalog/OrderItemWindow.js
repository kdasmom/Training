/**
 * Created by Andrey Baranov
 * date: 12/11/13 1:44 PM
 */


Ext.define('NP.view.catalog.OrderItemWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.catalog.orderitemwindow',

	requires: [
		'NP.lib.core.Config',
		'NP.view.shared.button.Close',
		'NP.view.shared.button.AddToFavorites',
		'NP.view.shared.button.RemoveFromFavorites',
		'NP.view.shared.button.AddToOrder'
	],

	layout          : 'fit',

	title           : NP.Translator.translate('Item details'),

	width           : '45%',
	height          : '40%',

	modal           : true,
	draggable       : true,
	resizable       : true,

	initComponent: function() {
		var that = this;

		this.bbar = [
			{ xtype: 'shared.button.close' },
			{
				xtype: 'shared.button.addtoorder',
				hidden: this.fromOrder,
				handler: function() {
					NP.lib.core.Net.remoteCall({
						requests: {
							service: 'CatalogService',
							action : 'addToOrder',
							userprofile_id : NP.Security.getUser().get('userprofile_id'),
							vcitem_id : that.data.vcitem_id,
							quantity: 1,
							success: function(data) {
								if (data) {
									that.hide();
									that.grid.getStore().reload();
									that.fireEvent('restoreshoppingcart');
								}
							}
						}
					});
				}
			},
			{
				xtype: 'shared.button.addtofavorites',
				hidden: this.data.favCount > 0,
				handler: function () {
					NP.lib.core.Net.remoteCall({
						requests: {
							service: 'CatalogService',
							action : 'toggleFavorites',
							userprofile_id : NP.Security.getUser().get('userprofile_id'),
							vcitem_id : that.data.vcitem_id,
							add: true,
							success: function(data) {
								if (data) {
									that.hide();
									that.grid.getStore().reload();
								}
							}
						}
					});
				}
			},
			{
				xtype: 'shared.button.removefromfavorites',
				hidden: this.data.favCount == 0,
				handler: function () {

					NP.lib.core.Net.remoteCall({
						requests: {
							service: 'CatalogService',
							action : 'toggleFavorites',
							userprofile_id : NP.Security.getUser().get('userprofile_id'),
							vcitem_id : that.data.vcitem_id,
							add: false,
							success: function(data) {
								if (data) {
									that.hide();
									that.grid.getStore().reload();
								}
							}
						}
					});
				}
			}
		];

		this.items = [
			{
				xtype: 'fieldcontainer',
				layout: 'hbox',
				items: [
					{
						xtype: 'image',
						src: this.data.vcitem_imageurl,
						layout: 'fit',
						height: '100%',
						flex: 0.5
					},
					{
						xtype: 'fieldcontainer',
						layout: 'vbox',
						flex: 0.5,
						items: [
							{
								xtype: 'displayfield',
								fieldLabel: NP.Translator.translate('Description'),
								value: this.data.vcitem_desc,
								layout: 'fit',
								width: 400,
								padding: '0 10'
							},
							{
								xtype: 'displayfield',
								fieldLabel: NP.Translator.translate('Package Qty'),
								value: this.data.vcitem_pkg_qty,
								layout: 'fit',
								width: 400,
								padding: '0 10'
							},
							{
								xtype: 'displayfield',
								fieldLabel: NP.Translator.translate('Case Qty'),
								value: this.data.vcitem_case_qty,
								layout: 'fit',
								width: 400,
								padding: '0 10'
							},
							{
								xtype: 'displayfield',
								fieldLabel: NP.Translator.translate('UOM'),
								value: this.data.vcitem_uom,
								layout: 'fit',
								width: 400,
								padding: '0 10'
							},
							{
								xtype: 'displayfield',
								fieldLabel: NP.Translator.translate('Brand'),
								value: this.data.vcitem_manufacturer,
								layout: 'fit',
								width: 400,
								padding: '0 10',
								hidden: this.data.vcitem_manufacturer == ''
							},
							{
								xtype: 'displayfield',
								fieldLabel: NP.Translator.translate('Weight'),
								value: this.data.vcitem_weight,
								layout: 'fit',
								width: 400,
								padding: '0 10',
								hidden: this.data.vcitem_weight == ''
							},
							{
								xtype: 'displayfield',
								fieldLabel: NP.Translator.translate('Color'),
								value: this.data.vcitem_color,
								layout: 'fit',
								width: 400,
								padding: '0 10',
								hidden: this.data.vcitem_color == ''
							},
							{
								xtype: 'displayfield',
								value: '<a href="{this.data.vcitem_infourl}">Additional info</a>',
								layout: 'fit',
								width: 400,
								padding: '0 10',
								hidden: this.data.vcitem_infourl == ''
							}
						]
					}
				]
			}
		];

		this.callParent(arguments);
	}
});