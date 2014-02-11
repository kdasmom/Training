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

	padding: '10',
	border: false,

	initComponent: function() {
		var me  = this;

		me.title = NP.Translator.translate(me.title);

		me.items = [
			{
				xtype: 'displayfield',
				fieldLabel: NP.Translator.translate('Editing Template'),
				value: ''
			},
			{
				xtype: 'htmleditor',
				name: 'poprint_text',
				fieldLabel: NP.Translator.translate('The following text will be included at the end of the Purchase Order and will be included on both the print and forward view of a Purchase Order. This will only display at the end of the Purchase Order. There is no limit to the number of characters allowed.'),
				labelAlign: 'top'
			}
		];

		me.callParent(arguments);
	}
});