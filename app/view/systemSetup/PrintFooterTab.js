/**
 * Created by Andrey Baranov
 * date: 2/4/14 12:46 PM
 */
Ext.define('NP.view.systemSetup.PrintFooterTab', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.printfootertab',

	requires: [
		'NP.lib.core.Translator',
		'Ext.form.field.HtmlEditor'
	],


	layout: 'fit',

	defaults: {
		labelWidth: '80%'
	},

	bodyPadding: 8,
	border: false,

	initComponent: function() {
		var me  = this;

		me.title = NP.Translator.translate(this.title);

		me.items = [{
			xtype     : 'htmleditor',
			name      : 'poprint_footer',
			fieldLabel: NP.Translator.translate('The following text will be included in the footer area on both the print and forward view of a Purchase Order. This will display on all pages.'),
			labelAlign: 'top'
		}];

		this.callParent(arguments);
	}
});