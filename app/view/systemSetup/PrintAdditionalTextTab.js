/**
 * Created by Andrey Baranov
 * date: 2/4/14 12:47 PM
 */

Ext.define('NP.view.systemSetup.PrintAdditionalTextTab', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.printadditionaltexttab',

	requires: ['NP.lib.core.Translator'],

	layout: {
		type: 'vbox',
		align: 'stretch'
	},

	defaults: {
		labelWidth: '80%'
	},

	padding: '0 10 10 10',
	border: false,

	initComponent: function() {
		var me  = this;

		me.title = NP.Translator.translate(me.title);

		me.tbar = [
			{
				xtype: 'shared.button.cancel',
				name: 'canceluploadbtn',
				handler: function() {
					me.getDockedItems('toolbar[dock="top"]')[0].hide();
					me.down('[name="params"]').show();
					me.down('[name="uploadattachment"]').hide();
				}
			},
			{
				xtype: 'shared.button.delete',
				name: 'deleteuploadbtn'
			},
			{
				xtype: 'shared.button.upload',
				name: 'uploadimagebtn'
			}
		];

		me.items = [
			{
				xtype: 'fieldcontainer',
				name: 'params',
				layout: 'fit',
				items: [
					{
						xtype: 'displayfield',
						fieldLabel: NP.Translator.translate('Editing Template'),
						value: '',
						labelWidth: '80%'
					},
					{
						xtype: 'htmleditor',
						name: 'poprint_additional_text',
						fieldLabel: NP.Translator.translate('The following text will be included at the end of the Purchase Order and will be included on both the print and forward view of a Purchase Order. This will only display at the end of the Purchase Order. There is no limit to the number of characters allowed.'),
						labelAlign: 'top'
					}
				]
			},
			{
				xtype: 'filefield',
				name: 'uploadattachment',
				fieldLabel: NP.Translator.translate('Select a valid PDF file to upload. The contents of this file will be appended at the end of your purchase orders'),
				width: 300,
				labelAlign: 'top'
			}
		];

		me.callParent(arguments);
	}
});