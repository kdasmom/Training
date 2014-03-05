/**
 * Created by Andrey Baranov
 * date: 3/3/14 11:30 AM
 */

Ext.define('NP.view.integration.OnDemandSync', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.integration.ondemandsync',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security',
		'NP.view.integration.TasksToRunGrid',
		'NP.view.integration.OutstandingRequestsGrid'
	],

	title: 'On Demand Sync',

	initComponent: function() {
		var me = this;
		me.title = NP.Translator.translate(me.title);

		me.tbar = [
			{
				xtype: 'shared.button.cancel'
			},
			{
				xtype: 'shared.button.next',
				text: 'Request Transfer'
			}
		];

		me.items = [
			{
				xtype: 'panel',
				title: NP.Translator.translate('HOW IT WORKS'),
				border: false,
				items: [
					{
						xtype: 'displayfield',
						value: NP.Translator.translate('The On Demand Synch allows you to request the Invoice or Vendor transfer to run outside the scheduled times that are listed on the Integration Overview Tab. The system will check to see if an integration request has been made every 15 minutes. This check will be run at the following times over a 24 hour period<br/>' +
							':00 minutes<br/>:15 past the hour</br>:30 past the hour</br>:45 past the hour<br/>' +
							'For example, if you initiate the request in NexusPayables to run the Invoice transfer at 10:05 am, the Invoice transfer will run at 10:15 am.'),
						padding: '10'
					},
					{

					}
				]
			},
			{
				xtype: 'panel',
				title: NP.Translator.translate('TASKS TO RUN'),
				border: false,
				padding: '0 0 20 0',
				items: [
					{
						xtype: 'displayfield',
						value: NP.Translator.translate('Please select the following transfers to run.'),
						padding: '10'
					},
					{
						xtype: 'integration.taskstorungrid',
						name: 'taskstorun',
						border: false,
						padding: '0 10 10 10'
					}
				]
			},
			{
				xtype: 'integration.outstandingrequestsgrid',
				name: 'outstandingrequests',
				title: NP.Translator.translate('OUTSTANDING ON DEMAND SYCH REQUESTS'),
				border: false
			}
		];

		me.listeners = {
			afterrender: function() {
				me.down('[name="taskstorun"]').getStore().load();
				me.down('[name="outstandingrequests"]').getStore().load();
			}
		};


		this.callParent(arguments);
	}
});