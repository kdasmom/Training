/**
 * Created by Andrey Baranov
 * date: 3/3/14 12:05 PM
 */

Ext.define('NP.view.integration.SynchHistoryGrid', {
	extend: 'NP.lib.ui.Grid',
	alias: 'widget.integration.synchhistorygrid',

	requires: [
		'NP.lib.core.Config'
	],

	paging  : true,

	initComponent: function() {
		var me = this;


		me.columns = [
			{
				text: NP.Translator.translate('Transfer Date'),
				flex: 0.2,
				dataIndex: 'transferred_datetm',
				xtype: 'datecolumn',
				renderer: function(val, meta, record) {
					return Ext.util.Format.date(record.raw['transferred_datetm'], "m/d/Y");
				}
			},
			{
				text: NP.Translator.translate('Transfer Time'),
				flex: 0.2,
				dataIndex: 'transferred_datetm',
				xtype: 'datecolumn',
				renderer: function(val, meta, record) {
					return Ext.util.Format.date(record.raw['transferred_datetm'], "H:i:s");
				}
			},
			{
				text: NP.Translator.translate('Task'),
				flex: 0.4,
				dataIndex: 'schedulename'
			},
			{
				text: NP.Translator.translate('Number Of Invoices'),
				flex: 0.2,
				dataIndex: 'Num_Of_Invoices',
				renderer: function(val, meta, record) {
					return record.raw['Num_Of_Invoices'];
				}
			},
			{
				text: NP.Translator.translate('Status'),
				flex: 0.2,
				dataIndex: 'status',
				renderer: function(val, meta, record) {
					return record.raw['status'];
				}
			},
			{
				text: NP.Translator.translate('Requested By'),
				flex: 0.2,
				dataIndex: 'person_firstname',
				renderer: function(val, meta, record) {
					return (!record.raw['person_firstname'] ? '' : record.raw['person_firstname'] + ' ') + record.raw['person_lastname'];
				}
			},
			{
				text: NP.Translator.translate('Details'),
				flex: 0.2,
				dataIndex: 'Details',
				renderer: function(val, meta, record) {
					return record.raw['Details'];
				}
			}
		];

		me.store = Ext.create('NP.store.integration.PnSchedules', {
			service: 'PnScheduleService',
			action: 'getSynchHistory',
			autoLoad: true
		});

		me.callParent(arguments);
	}
});