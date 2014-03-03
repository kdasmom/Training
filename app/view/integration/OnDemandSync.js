/**
 * Created by Andrey Baranov
 * date: 3/3/14 11:30 AM
 */

Ext.define('NP.view.integration.OnDemandSync', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.integration.ondemandsync',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security'
	],

	title: 'On Demand Sync',

	initComponent: function() {
		var me = this;
		me.title = NP.Translator.translate(me.title);

		me.items = [];


		this.callParent(arguments);
	}
});