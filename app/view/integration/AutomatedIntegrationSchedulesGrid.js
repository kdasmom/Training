/**
 * Created by Andrey Baranov
 * date: 3/3/14 11:39 AM
 */


Ext.define('NP.view.integration.AutomatedIntegrationSchedulesGrid', {
	extend: 'NP.lib.ui.Grid',
	alias: 'widget.integration.automatedintegrationschedulesgrid',

	requires: [
		'NP.lib.core.Config'
	],

	paging  : true,
	stateful: true,

	initComponent: function() {
		var me = this;


		me.columns = [
			{
				text: NP.Translator.translate('Transfer Name'),
				flex: 0.6,
				dataIndex: 'schedulename'
			},
			{
				text: NP.Translator.translate('Integration Name'),
				flex: 0.6,
				dataIndex: 'integration_package_name',
				renderer: function(val, meta, record) {
					return record.raw['integration_package_name'];
				}
			},
			{
				text: NP.Translator.translate('Schedule'),
				flex: 0.6,
				dataIndex: 'run_frequency',
				renderer: function(val, meta, record) {
					return record.raw['run_frequency'];
				}
			},
			{
				text: NP.Translator.translate('Last Run'),
				flex: 0.2,
				dataIndex: 'LastRun_datetm',
				renderer: function(val, meta, record) {
					return Ext.util.Format.date(record.raw['LastRun_datetm'], "m-d-Y")
				}
			},
			{
				text: NP.Translator.translate('Next Run'),
				flex: 0.2,
				dataIndex: 'Next_Scheduled_Run_Time',
				renderer: function(val, meta, record) {
					return Ext.util.Format.date(record.raw['Next_Scheduled_Run_Time'], "m-d-Y")
				}
			}
		];

		me.store = Ext.create('NP.store.integration.PnSchedules', {
			service: 'PnScheduleService',
			action: 'getAllAvailabletransfer',
			autoLoad: true
		});

		me.callParent(arguments);
	}
});