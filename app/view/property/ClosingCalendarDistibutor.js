/**
 * Created by Andrey Baranov
 * date: 4/22/2014 4:47 PM
 */


Ext.define('NP.view.property.ClosingCalendarDistibutor', {
	extend: 'Ext.form.Panel',
	alias: 'widget.property.closingcalendardistibutor',

	requires: [
		'NP.view.shared.button.Cancel',
		'NP.view.shared.button.Save'
	],

	title      : 'Closing Calendar Distributor',

	layout     : 'form',
	bodyPadding: 8,
	margin     : '0 0 0 8',
	hidden     : true,
	defaults	: {
		labelWidth: 150
	},

	initComponent: function() {
		var me = this;

		this.tbar = {
			dock  : 'top',
			items : [
				{ xtype: 'shared.button.cancel' },
				{ xtype: 'shared.button.save' }
			]
		};

		this.items = [
			{
				xtype: 'displayfield',
				name: 'calendar_name',
				fieldLabel: NP.Translator.translate('Calendar To Distribute')
			},
			{
				xtype: 'customcombo',
				name: 'Org_fiscalcal_id',
				valueField: 'fiscalcal_id',
				displayField: 'fiscalcal_name',
				selectFirstRecord: true,
				fieldLabel: NP.Translator.translate('Assign to Properties currently using the following closing calendar:'),
				allowBlank: false,
				store: Ext.create('NP.store.property.FiscalCals', {
					service: 'FiscalCalService',
					action: 'getFiscalCalendarsByType',
					extraParams: {
						type: 'template',
						fiscal_calendar_id: null,
						asp_client_id: null
					}
				})
			}
		];

		this.callParent(arguments);
	}
});