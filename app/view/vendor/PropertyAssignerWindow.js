/**
 * Add / remove insurance property association form
 *
 * @author Renat Gatyatov
 */
Ext.define('NP.view.vendor.PropertyAssignerWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.vendor.propertyassignerwindow',

	requires: [
		'NP.lib.core.Config',
		'NP.view.shared.button.Cancel',
		'NP.view.shared.button.Save',
		'NP.view.shared.PropertyAssigner',
		'NP.lib.core.Translator'
	],

	title: 'Add / Remove Insurance Property Association',

	layout          : 'fit',

	width           : 700,
	height          : 400,

	modal           : true,
	draggable       : false,
	resizable       : false,

	initComponent: function() {
		var that = this;

		this.title = NP.Translator.translate(that.title);

		this.tbar = [
			{ xtype: 'shared.button.cancel' },
			{ xtype: 'shared.button.save', text: NP.Translator.translate('Add') }
		];

		this.items = [
			{
				xtype   : 'form',
				border: false,
				layout: {
					type : 'vbox',
					align: 'stretch'
				},
				items: [
					{
						xtype: 'displayfield',
						hideLabel: true,
						padding: '10',
						value: NP.Translator.translate('Select Properties')
					},
					{
						xtype: 'hidden',
						name: 'startIndex',
						value: this.startIndex
					},
					{
						xtype      : 'shared.propertyassigner',
						itemId     : 'insuranceProperties',
						name       : 'insuranceProperties',
						fieldLabel : '',
						padding    : '0 10',
						height     : 250
					}
				]
			}
		];

		this.callParent(arguments);

		this.on('afterrender', function(el) {
			this.queryById('insuranceProperties').setValue(this.data);
		}, this);
	}
});