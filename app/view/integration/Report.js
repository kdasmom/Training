/**
 * Created by Andrey Baranov
 * date: 3/3/14 11:33 AM
 */

Ext.define('NP.view.integration.Report', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.integration.report',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security'
	],

	title: 'Report',

	initComponent: function() {
		var me = this;
		me.title = NP.Translator.translate(me.title);

		me.html = NP.Translator.translate('Coming soon...');

		me.items = [];


		this.callParent(arguments);
	}
});
