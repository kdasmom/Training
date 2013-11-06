/**
 * Created by rnixx on 11/6/13.
 */

Ext.define('NP.view.vendor.AddImagesWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.vendor.addimageswindow',

	requires: [
		'NP.lib.core.Config',
		'NP.view.shared.button.Cancel',
		'NP.view.shared.button.Save',
		'NP.lib.ui.Grid',
		'NP.lib.core.Translator',
		'NP.view.image.ImageGrid'
	],

	layout          : 'fit',
	title			: NP.Translator.translate('Add images'),

	width           : 770,
	height          : 420,

	modal           : true,
	draggable       : false,
	resizable       : false,

	vendor_id: null,

	initComponent: function() {
		var that = this;

		this.items = [{
			xtype: 'image.imagegrid',
			cols: this.getCols(),
			store: Ext.create('NP.store.image.ImageIndexes', {
				service           : 'VendorService',
				action            : 'findImages',
				paging: true,
				extraParams: {
					vendor_id: that.vendor_id
				},
				autoLoad: true
			})
		}];

		this.callParent(arguments);
	},

	getCols: function() {
		return [
			'image.gridcol.Name',
			'image.gridcol.ImageStatus',
			'property.gridcol.PropertyName',
			'vendor.gridcol.VendorName',
			'image.gridcol.InvoiceNumber',
			'image.gridcol.Amount',
			'image.gridcol.InvoiceDate'
		];
	}
});