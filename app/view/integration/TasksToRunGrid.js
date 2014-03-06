/**
 * Created by Andrey Baranov
 * date: 3/3/14 5:35 PM
 */


Ext.define('NP.view.integration.TasksToRunGrid', {
	extend: 'NP.lib.ui.Grid',
	alias: 'widget.integration.taskstorungrid',

	requires: [
		'NP.lib.core.Config'
	],

	paging  : true,
	selModel: Ext.create('Ext.selection.CheckboxModel'),

	initComponent: function() {
		var me = this;
		me.columns = [
			{
				text: NP.Translator.translate('Schedule Name'),
				dataIndex: "schedulename",
				flex: 1
			}
		];

		me.store = Ext.create('NP.store.integration.PnSchedules', {
			service: 'PnScheduleService',
			action: 'getOnDemandTransfer'
		});

		me.callParent(arguments);
	}
});