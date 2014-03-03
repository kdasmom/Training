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
				flex: 0.6
			},
			{
				text: NP.Translator.translate('Integration Name'),
				flex: 0.6
			},
			{
				text: NP.Translator.translate('Schedule'),
				flex: 0.6
			},
			{
				text: NP.Translator.translate('Last Run'),
				flex: 0.2
			},
			{
				text: NP.Translator.translate('Next Run'),
				flex: 0.2
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