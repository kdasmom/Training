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

	layout: 'fit',

	initComponent: function() {
		var me = this;
		me.title = NP.Translator.translate(me.title);

		me.items = [{
			xtype  : 'panel',
			title  : NP.Translator.translate('AUTOMATED INTEGRATION SCHEDULE'),
			layout : {
				type : 'vbox',
				align: 'stretch'
			},
			border : false,
			items  : [
				{
					xtype  : 'component',
					html   : NP.Translator.translate('The following schedule is the breakdown of all the automated transfers setup to run between NexusPayables and your general ledger system, including the time the transfer last ran and the next scheduled run time.'),
					padding: 8
				},
				{
					xtype: 'integration.automatedintegrationschedulesgrid',
					flex : 1
				},
				{
					xtype: 'integration.synchhistorygrid',
					title : NP.Translator.translate('SYNCH HISTORY'),
					border: false,
					flex  : 1
				}
			]
		}];


		this.callParent(arguments);
	}
});