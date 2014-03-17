/**
 * Created by Andrey Baranov
 * date: 3/3/14 11:05 AM
 */

Ext.define('NP.view.integration.Main', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.integration.main',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security',
		'NP.view.integration.Overview',
		'NP.view.integration.OnDemandSync',
		'NP.view.integration.Report',
		'NP.view.integration.Settings'
	],

	title: 'Integration',

	initComponent: function() {
		var me = this;
			me.title = NP.Translator.translate(me.title);

		me.items = [
			{
				xtype: 'integration.overview'
			},
			{
				xtype: 'integration.ondemandsync'
			},
			{
				xtype: 'integration.report'
			},
			{
				xtype: 'integration.settings'
			}
		];


		this.callParent(arguments);
	}
});