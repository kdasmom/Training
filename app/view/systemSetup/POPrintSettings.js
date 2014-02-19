/**
 * Created by Andrey Baranov
 * date: 2/3/14 7:17 AM
 */
Ext.define('NP.view.systemSetup.POPrintSettings', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.poprintsettings',

	requires: [
		'NP.lib.core.Translator',
		'NP.view.shared.button.Cancel',
		'NP.view.shared.button.New',
		'NP.view.systemSetup.TemplatesManager'
	],

	title: 'PO Print Settings',
	layout: {
		type: 'fit',
		align: 'stretch'
	},
	autoScroll: true,

	initComponent: function() {
		var me = this;

		me.title = NP.Translator.translate(me.title);

		me.callParent(arguments);
	}
});