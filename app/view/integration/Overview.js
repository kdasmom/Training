/**
 * Created by Andrey Baranov
 * date: 3/3/14 11:12 AM
 */

Ext.define('NP.view.integration.Overview', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.integration.overview',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security',
		'NP.view.integration.AutomatedIntegrationSchedulesGrid',
		'NP.view.integration.SynchHistoryGrid'
	],

	title: 'Overview',

	autoScroll: true,

	initComponent: function() {
		var me = this;
		me.title = NP.Translator.translate(me.title);

		me.items = [
			{
				xtype: 'panel',
				title: NP.Translator.translate('AUTOMATED INTEGRATION SCHEDULE'),
				padding: '5 0 20 0',
				border: false,
				items: [
					{
						xtype: 'displayfield',
						value: NP.Translator.translate('The following schedule is the breakdown of all the automated transfers setup to run between NexusPayables and your general ledger system, including the time the transfer last ran and the next scheduled run time.'),
						padding: '5 5 20 5'
					},
					{
						xtype: 'integration.automatedintegrationschedulesgrid'
					}
				]
			},
			{
				xtype: 'panel',
				title: NP.Translator.translate('SYNCH HISTORY'),
				border: false,
				items: [
					{
						xtype: 'integration.synchhistorygrid'
					}
				]
			}
		];


		this.callParent(arguments);
	}
});