/**
 * Created by Andrey Baranov
 * date: 2/4/14 12:46 PM
 */


Ext.define('NP.view.systemSetup.PrintFooterTab', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.printfootertab',

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

		me.title = NP.Translator.translate(this.title);

		me.items = [
			{
				xtype: 'displayfield',
				fieldLabel: NP.Translator.translate('Editing Template'),
				value: ''
			},
			{
				xtype: 'htmleditor',
				name: 'poprint_text',
				fieldLabel: NP.Translator.translate('The following text will be included in the footer area on both the print and forward view of a Purchase Order. This will display on all pages.'),
				labelAlign: 'top'
			}
		];

		this.callParent(arguments);
	}
});