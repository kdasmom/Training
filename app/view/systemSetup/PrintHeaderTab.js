/**
 * Created by Andrey Baranov
 * date: 2/4/14 12:38 PM
 */
Ext.define('NP.view.systemSetup.PrintHeaderTab', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.printheadertab',

	requires: [
		'NP.lib.core.Translator',
		'Ext.form.field.HtmlEditor'
	],

	layout: {
		type: 'vbox',
		align: 'stretch'
	},

	defaults: {
		labelWidth: '80%'
	},

	bodyPadding: 8,
	border: false,

	initComponent: function() {
		var me  = this;

		me.title = NP.Translator.translate(this.title);

		me.items = [
			{
				xtype     : 'checkbox',
				name      : 'poprint_customfields',
				inputValue: '0',
				boxLabel  : NP.Translator.translate('Please check here if you want to include the PO Custom Fields in the header')
			},
			{
				xtype     : 'htmleditor',
				name      : 'poprint_header',
				fieldLabel: NP.Translator.translate('The following text will be included in the header area on both the print and forward view of a Purchase Order. '),
				labelAlign: 'top',
				flex      : 1
			}
		];

		this.callParent(arguments);
	}
});