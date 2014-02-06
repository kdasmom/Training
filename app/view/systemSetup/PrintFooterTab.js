/**
 * Created by Andrey Baranov
 * date: 2/4/14 12:46 PM
 */


Ext.define('NP.view.systemSetup.PrintFooterTab', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.printfootertab',

	requires: ['NP.lib.core.Translator'],

	layout: 'fit',

	defaults: {
		labelWidth: '80%'
	},

	padding: '10',
	border: false,

	initComponent: function() {
		var me  = this;

		me.title = NP.Translator.translate(this.title);

		me.items = [];

		this.callParent(arguments);
	}
});