/**
 * Created by Andrey Baranov
 * date: 3/3/14 11:36 AM
 */

Ext.define('NP.view.integration.Settings', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.integration.settings',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security'
	],

	title: 'Settings',

	initComponent: function() {
		var me = this;
		me.title = NP.Translator.translate(me.title);

		me.items = [];


		this.callParent(arguments);
	}
});