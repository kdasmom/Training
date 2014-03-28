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
				xtype: 'datecolumn',
				text: NP.Translator.translate('Last Run'),
				flex: 0.2,
				dataIndex: 'lastrun_datetm',
				renderer: function(val, meta, record) {
					return Ext.util.Format.date(val, NP.Config.getDefaultDateTimeFormat())
				}
			},
			{
				text: NP.Translator.translate('Next Run'),
				flex: 0.2,
				dataIndex: 'next_scheduled_run_time',
				renderer: function(val, meta, record) {
					return Ext.util.Format.date(val, NP.Config.getDefaultDateTimeFormat())
				}
			}
		];

		me.store = Ext.create('NP.store.integration.PnSchedules', {
			service: 'IntegrationService',
			action: 'getAllAvailabletransfer',
			autoLoad: true
		});

		me.callParent(arguments);
	}
});