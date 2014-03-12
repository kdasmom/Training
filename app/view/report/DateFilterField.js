/**
 * Date field for reports
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.report.DateFilterField', {
	extend: 'Ext.form.FieldContainer',
    alias: 'widget.report.datefilterfield',

	requires: [
		'NP.lib.core.Translator',
		'Ext.form.RadioGroup',
		'NP.lib.ui.ComboBox'
	],

	fieldLabel: 'Date Filter',

	layout    : 'vbox',
	allowBlank: false,

	initComponent: function() {
		var me              = this,
			fromYear        = 2006,
			toYear          = new Date().getFullYear(),
			quarterYears    = [],
			startPeriod     = Ext.Date.parse('2001-12-01', 'Y-m-d'),
			now             = new Date(),
			currentPeriod   = Ext.Date.parse(now.getFullYear() + '-' + (now.getMonth()+1) + '-01', 'Y-n-d'),
			postDateForward = parseInt(NP.Config.getSetting('CP.INVOICE_POST_DATE_FORWARD', '0')),
			endPeriod       = Ext.Date.add(currentPeriod, Ext.Date.MONTH, postDateForward),
			periods         = [];

		me.dateFromLabel = NP.Translator.translate('From');
		me.dateToLabel   = NP.Translator.translate('To');
		me.periodLabel   = NP.Translator.translate('Period');

		// Create the data for the quarter year combo store
		for (var i=toYear; i>=fromYear; i--) {
			quarterYears.push({ quarter_year: i });
		}

		// Create the data for the period combos store
		while (endPeriod.getTime() >= startPeriod.getTime()) {
			periods.push({
				period_name: Ext.Date.format(endPeriod, 'm/Y'),
				period_val : Ext.Date.format(endPeriod, 'Y-m-d')
			});
			endPeriod = Ext.Date.add(endPeriod, Ext.Date.MONTH, -1);
		}

		me.fieldLabel = NP.Translator.translate(me.fieldLabel);

		me.items = [
			{
				xtype   : 'radiogroup',
				layout  : 'hbox',
				defaults: { name: 'filterType', margin: '0 8 0 0' },
				items   : [
					{ boxLabel: 'Period Range', inputValue: 'periodRange', checked: true },
					{ boxLabel: 'Period', inputValue: 'period' },
					{ boxLabel: 'Cycle From Date', inputValue: 'cycleFrom' },
					{ boxLabel: 'Cycle To Date', inputValue: 'cycleTo' },
					{ boxLabel: 'Approval Date', inputValue: 'approval' },
					{ boxLabel: 'On Hold Date', inputValue: 'hold' },
					{ boxLabel: 'Created Date', inputValue: 'created' },
					{ boxLabel: 'Received On Date', inputValue: 'received' },
					{ boxLabel: 'Invoice Date', inputValue: 'invoice' },
					{ boxLabel: 'PO Date', inputValue: 'po' },
					{ boxLabel: 'Due Date', inputValue: 'due' },
					{ boxLabel: 'Submitted Date', inputValue: 'submitted' },
					{ boxLabel: 'Paid Date', inputValue: 'paid' },
					{ boxLabel: 'Calendar Quarter', inputValue: 'quarter' },
					{ boxLabel: 'Needed By', inputValue: 'neededBy' },
					{ boxLabel: 'Voided Date', inputValue: 'voided' },
					{ boxLabel: 'Sent to GL Date', inputValue: 'sentToGl' }
				],
				listeners: {
					change: me.changeDateType.bind(me)
				}
			},{
				xtype : 'container',
				layout: 'card',
				items : [
					{
						xtype : 'container',
						layout: 'hbox',
						defaults: { margin: '0 16 0 0' },
						items: [
							{
								xtype       : 'customcombo',
								fieldLabel  : me.dateFromLabel,
								name        : 'dateFilterPeriodFrom',
								displayField: 'period_name',
								valueField  : 'period_val',
								labelWidth  : 45,
								store       : Ext.create('Ext.data.Store', {
									fields: [
										{ name: 'period_name' },
										{ name: 'period_val', type: 'date', dateReadFormat: 'Y-m-d' }
									],
									data: periods
								}),
								value       : currentPeriod
							},
							{
								xtype       : 'customcombo',
								fieldLabel  : me.dateToLabel,
								name        : 'dateFilterPeriodTo',
								displayField: 'period_name',
								valueField  : 'period_val',
								labelWidth  : 25,
								store       : Ext.create('Ext.data.Store', {
									fields: [
										{ name: 'period_name' },
										{ name: 'period_val', type: 'date', dateReadFormat: 'Y-m-d' }
									],
									data: periods
								}),
								value       : currentPeriod
							}
						]
					},{
						xtype : 'container',
						layout: 'hbox',
						defaults: { margin: '0 16 0 0' },
						items : [
							{
								xtype     : 'datefield',
								fieldLabel: me.dateFromLabel,
								name      : 'dateFilterDateFrom',
								labelWidth: 45
							},
							{
								xtype     : 'datefield',
								fieldLabel: me.dateToLabel,
								name      : 'dateFilterDateTo',
								labelWidth: 25
							}
						]
					},{
						xtype : 'container',
						layout: 'hbox',
						defaults: { margin: '0 16 0 0' },
						items: [
							{
								xtype       : 'customcombo',
								fieldLabel  : NP.Translator.translate('Year'),
								name        : 'dateFilterQuarterYear',
								displayField: 'quarter_year',
								valueField  : 'quarter_year',
								labelWidth  : 35,
								store       : Ext.create('Ext.data.Store', {
									fields: [
										{ name: 'quarter_year', type: 'int' }
									],
									data: quarterYears
								}),
								selectFirstRecord: true
							},
							{
								xtype       : 'customcombo',
								fieldLabel  : NP.Translator.translate('Quarter'),
								name        : 'dateFilterQuarter',
								displayField: 'quarter_val',
								valueField  : 'quarter_val',
								labelWidth  : 55,
								store       : Ext.create('Ext.data.Store', {
									fields: ['quarter_val'],
									data: [
										{ quarter_val: 'Q1'},
										{ quarter_val: 'Q2'},
										{ quarter_val: 'Q3'},
										{ quarter_val: 'Q4'}
									]
								}),
								selectFirstRecord: true
							}
						]
					}
				]
			}
		];

		me.callParent(arguments);

		me.addEvents('change');

		me.filterType    = me.down('radiogroup');
		me.dateContainer = me.filterType.nextSibling();
	},

	changeDateType: function(field, newVal, oldVal) {
		var me         = this,
			layout     = me.down('radiogroup').nextSibling().getLayout(),
			filterType = newVal.filterType,
			label,
			fn;

		if (filterType == 'periodRange' || filterType == 'period') {
			layout.setActiveItem(0);
			if (filterType == 'periodRange') {
				label = me.dateFromLabel;
				fn    = 'show';
			} else {
				label = me.periodLabel;
				fn    = 'hide';
			}
			me.down('[name="dateFilterPeriodFrom"]').setFieldLabel(label);
			me.down('[name="dateFilterPeriodTo"]')[fn]();
		} else if (filterType == 'quarter') {
			layout.setActiveItem(2);
		} else {
			layout.setActiveItem(1);
		}

		me.fireEvent('change', field, newVal, oldVal);
	},

	getState: function() {
		var me         = this,
			filterType = me.getFilterType(),
			filterName = me.down('[inputValue="' + filterType + '"]').boxLabel,
			dateType   = 'date',
			dateFrom,
			dateTo     = null;

		if (filterType == 'periodRange' || filterType == 'period') {
			dateFrom = me.getDateFromField().getValue();
			if (filterType == 'periodRange') {
				dateTo   = me.getDateToField().getValue();
			}
			dateType = 'period';
		} else if (filterType == 'quarter') {
			var quarterYear = me.getDateFromField().getValue(),
				quarter     = me.getDateToField().getValue(),
				format      = 'Y-m-d H:i:s',
				startTime   = ' 00:00:00',
				endTime     = ' 11:59:59';

			if (quarter == 'Q1') {
				dateFrom = Ext.Date.parse(quarterYear + '-01-01' + startTime, format);
				dateTo = Ext.Date.parse(quarterYear + '-03-31' + endTime, format);
			} else if (quarter == 'Q2') {
				dateFrom = Ext.Date.parse(quarterYear + '-04-01' + startTime, format);
				dateTo = Ext.Date.parse(quarterYear + '-06-30' + endTime, format);
			} else if (quarter == 'Q3') {
				dateFrom = Ext.Date.parse(quarterYear + '-07-01' + startTime, format);
				dateTo = Ext.Date.parse(quarterYear + '-09-30' + endTime, format);
			} else if (quarter == 'Q4') {
				dateFrom = Ext.Date.parse(quarterYear + '-10-01' + startTime, format);
				dateTo = Ext.Date.parse((quarterYear+1) + '-12-31' + endTime, format);
			}
		} else {
			dateFrom = me.getDateFromField().getValue();
			dateTo   = me.getDateToField().getValue();
		}

		return {
			filterName: filterName,
			filterType: filterType,
			dateType  : dateType,
			dateFrom  : dateFrom,
			dateTo    : dateTo
		}
	},

	setFilterTypeVisibility: function(filterTypes) {
		var me = this;

		Ext.suspendLayouts();

		for (var filterType in filterTypes) {
			me.filterType.down('[inputValue="' + filterType + '"]')[filterTypes[filterType]]();
		}

		Ext.resumeLayouts(true);
	},

	getFilterType: function() {
		return this.filterType.getValue().filterType;
	},

	getDateFromField: function() {
		var me         = this,
			filterType = me.getFilterType();

		if (filterType == 'periodRange' || filterType == 'period') {
			return me.down('[name="dateFilterPeriodFrom"]');
		} else if (filterType == 'quarter') {
			return me.down('[name="dateFilterQuarterYear"]');
		} else {
			return me.down('[name="dateFilterDateFrom"]');
		}
	},

	getDateToField: function() {
		var me         = this,
			filterType = me.getFilterType();

		if (filterType == 'periodRange' || filterType == 'period') {
			return me.down('[name="dateFilterPeriodTo"]');
		} else if (filterType == 'quarter') {
			return me.down('[name="dateFilterQuarter"]');
		} else {
			return me.down('[name="dateFilterDateTo"]');
		}
	},

	isValid: function() {
		var me      = this,
			state   = me.getState(),
			isValid = true;
		
		if (!me.allowBlank) {
			if (state.dateFrom === null) {
				me.getDateFromField().markInvalid(NP.Translator.translate('This field is required'));
				isValid = false;
			}

			if (state.filterType !== 'period' && state.dateTo === null) {
				me.getDateToField().markInvalid(NP.Translator.translate('This field is required'));
				isValid = false;
			}
		}

		return isValid;
	}
});