/**
 * Created by Andrey Baranov
 * date: 2/4/14 12:47 PM
 */

Ext.define('NP.view.systemSetup.PrintAdditionalTextTab', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.printadditionaltexttab',

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