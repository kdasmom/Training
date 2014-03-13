/**
 * Created by Andrey Baranov
 * date: 3/3/14 5:40 PM
 */

Ext.define('NP.view.integration.OutstandingRequestsGrid', {
	extend: 'NP.lib.ui.Grid',
	alias: 'widget.integration.outstandingrequestsgrid',

	requires: [
		'NP.lib.core.Config'
	],

	paging  : true,

	initComponent: function() {
		var me = this;


		me.columns = [
			{
				text: NP.Translator.translate('Transfer Date'),
				flex: 0.2
			},
			{
				text: NP.Translator.translate('Transfer Time'),
				flex: 0.2
			},
			{
				text: NP.Translator.translate('Task'),
				flex: 0.2
			},
			{
				text: NP.Translator.translate('Requested By'),
				flex: 0.2
			},
			{
				text: NP.Translator.translate('Status'),
				flex: 0.2
			}
		];

		me.store = Ext.create('NP.store.integration.PnSchedules', {
			service: 'IntegrationService',
			action: 'getOutstandingSync'
		});

		me.callParent(arguments);
	}
});