Ext.define('NP.view.systemSetup.WorkflowRulesView', {
	extend: 'Ext.panel.Panel',
	alias:  'widget.systemsetup.workflowrulesview',
	
	requires: [
		'NP.lib.core.Config',
		'NP.view.shared.button.Print',
		'NP.view.shared.button.Cancel',
		'NP.view.shared.button.Edit',
		'NP.view.shared.ExpandableSection',
		'Ext.draw.Text'
	],

	layout: 'fit',

	modal     : true,
	autoScroll: true,

	width : 700,
	height: 400,

	bodyStyle  : 'background-color: white',
	bodyPadding: 10,
	border     : false,

	initComponent: function() {
		var me = this,
			fieldLabelWidth = 150,
			fieldPadding    = '0 10';

		this.layout = {
			type : 'vbox',
			pack : 'start',
			align: 'stretch'
		};
		this.defaults = {
			border: false
		};

		this.autoScroll = true;

		this.title = NP.Translator.translate('Workflow Rule - {rulename}', {rulename: this.data.rule.wfrule_name});

		var properties = [];
		for (var key in this.data.properties) {
			properties.push({
				html: this.data.properties[key].region_name + ' - ' + this.data.properties[key].property_name
			});
		}

		this.items = [
			{
				xtype     : 'displayfield',
				fieldLabel: NP.Translator.translate('Rule Type'),
				value     : me.data.rule.wfruletype_name,
				labelWidth: fieldLabelWidth,
				padding   : fieldPadding
			}
		];

		if (this.data.rule.region_id !== null) {
			this.items.push({
				xtype     : 'displayfield',
				fieldLabel: NP.Translator.translate('Applied to Properties'),
				value     : NP.Translator.translate('REGION: {region_name}', { region_name: this.data.rule.region_name }),
				labelWidth: fieldLabelWidth,
				padding   : fieldPadding
			});
		}
		else
		{
			if (!this.data.rule.allProperties) {
				this.items.push(
					{
						xtype     : 'fieldcontainer',
						fieldLabel: NP.Translator.translate('Applied to Properties'),
						labelWidth: fieldLabelWidth,
						padding   : fieldPadding,
						items     : [
							{
								xtype: 'component',
								border: false,
								padding: '5 0 0 0',
								html: NP.Translator.translate('SPECIFIC Properties')
							},
							{
								border: false,
								data: this.data.properties,
								tpl: [
									'<ul>',
										'<tpl for=".">',
											'<li>{property_name}</li>',
										'</tpl>',
									'</ul>'
								]
							}
						]
					}
				);
			}
			else {
				this.items.push({
					xtype     : 'displayfield',
					fieldLabel: NP.Translator.translate('Applied to Properties'),
					value     : NP.Translator.translate('ALL Properties'),
					labelWidth: fieldLabelWidth,
					padding   : fieldPadding
				});
			}
		}



		this.items.push(
			{
				xtype     : 'displayfield',
				fieldLabel: NP.Translator.translate('Last Update Date'),
				value     : Ext.Date.format(Ext.Date.parse(me.data.rule.wfrule_datetm, NP.Config.getServerDateFormat()), NP.Config.getDefaultDateTimeFormat()) + ' (' + me.data.rule.userprofile_username + ')',
				labelWidth: fieldLabelWidth,
				padding   : fieldPadding
			}
		);

		if (this.data.rule.wfruletype_id != 15 && this.data.rule.wfruletype_id != 4) {
			this.items.push(
				{
					xtype     : 'fieldcontainer',
					fieldLabel: NP.Translator.translate('Details'),
					labelWidth: fieldLabelWidth,
					padding   : fieldPadding,
					items     : this.sectionDetails(this.data)
				}
			);
		}

		if (this.data.rule.wfruletype_id != 4) {
			this.items.push(
				{
					xtype     : 'fieldcontainer',
					fieldLabel: NP.Translator.translate('Routing'),
					labelWidth: fieldLabelWidth,
					padding   : fieldPadding,
					items     : this.sectionRouting(this.data)
				}
			);
		}

		this.tbar = [
			{ xtype: 'shared.button.cancel', itemId: 'buttonWorkflowBackToMain' },
			{ xtype: 'shared.button.edit',   itemId: 'buttonWorkflowEditRule' },
			{ xtype: 'shared.button.print',  itemId: 'buttonWorkflowPrint' }
		];

		this.callParent(arguments);
	},

	sectionDetails: function(data) {
		var details = [];

		if (data.rule.wfruletype_id == 5 || data.rule.wfruletype_id == 12) {
			var supression;

			switch (data.rule.wfrule_number) {
				case '0':
					supression = NP.Translator.translate('Never Suppress Email');
					break;
				case '-1':
					supression = NP.Translator.translate('Suppress Email for the rest of the period');
					break;
				default:
					supression = NP.Translator.translate('Suppress Email for {supression} hours', {supression: data.rule.runhour});
			}

			details.push({
				xtype: 'panel',
				items: [
					{
						xtype: 'text',
						text: NP.Translator.translate('Email Suppression') + ': ' + supression
					}
				]
			});
		}

		var description = '',
			wfruletype_tablename = (data.rule.wfruletype_tablename != null) ? data.rule.wfruletype_tablename.toLowerCase() : null,
			wfrule_string = (data.rule.wfrule_string != null) ? data.rule.wfrule_string.toLowerCase() : null,
			wfrule_operand = (data.rule.wfrule_operand != null) ? data.rule.wfrule_operand.toLowerCase() : null;

		if (data.rule.wfrule_operand !== null) {
			if (wfruletype_tablename == 'budget' && data.rule.wfruletype_id != 12) {
				description += 'If the variance is ';
			} else if (wfruletype_tablename == 'userprofile') {
				description += 'If the assigned user has ';
			} else if (wfruletype_tablename == 'email' || data.rule.wfruletype_id == 12) {
			} else {
				description += 'If total amount is ';
			}

			description += data.rule.wfrule_operand + ' ';
			if (wfrule_string == 'actual') {
				description += data.rule.wfrule_number + ' ';
				if (wfrule_operand == 'in range') {
					description += ' to ' + data.rule.wfrule_number_end + ' ';
				}
			} else if (wfrule_string == 'percentage') {
				description += data.rule.wfrule_number + '%';
			} else {
				description += data.rule.wfrule_string;
			}
		}

		details.push({
			xtype: 'panel',
			items: [
				{
					xtype: 'text',
					text: description
				}
			]
		});

		// GL Codes
		if ([3, 7, 8, 13, 29, 31, 33, 37].indexOf(data.rule.wfruletype_id) > -1) {
			var codes = [];
			for (var key in data.categories) {
				codes.push({
					html:
						data.categories[key].integration_package_name + ' - ' +
							data.categories[key].glaccount_name +
							' (' + data.categories[key].glaccount_number + ')'
				});
			}

			details.push({
				xtype: 'shared.ExpandableSection',
				opener: NP.Translator.translate('GL Codes') + ':',
				itemId: 'expandableGLCodes',
				values: codes
			});
		}

		// Departments
		if ([35, 36].indexOf(data.rule.wfruletype_id) > -1) {
			var unittext = NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit');
			var units = [];

			for (var key in data.units) {
				units.push({html: data.units[key].property_name + ' - ' + data.units[key].unit_number});
			}

			details.push({
				xtype: 'shared.ExpandableSection',
				opener: NP.Translator.translate('Departments') + ':',
				itemId: 'expandableUnits',
				values: units
			});
		}

		// GL Categories
		if ([9, 10, 11, 12, 14, 30, 32, 34, 38].indexOf(data.rule.wfruletype_id) > -1) {
			var categories = [];
			for (var key in data.categories) {
				categories.push({
					html:
						data.categories[key].integration_package_name + ' - ' +
							data.categories[key].glaccount_name
				});
			}

			details.push({
				xtype: 'shared.ExpandableSection',
				opener: NP.Translator.translate('GL Categories') + ':',
				itemId: 'expandableGLCategories',
				values: categories
			});
		}

		// Job Codes
		if ([21, 22].indexOf(data.rule.wfruletype_id) > -1) {
			var jobcode,
				jobcodes = [];

			for (var key in data.jobcodes) {
				jobcode = data.jobcodes[key].jbjobcode_name;
				if (data.jobcodes[key].jbjobcode_desc != '') {
					jobcode = jobcode + ' (' + data.jobcodes[key].jbjobcode_desc + ')';
				}

				jobcodes.push({	html: jobcode });
			}

			details.push({
				xtype: 'shared.ExpandableSection',
				opener: NP.Translator.translate('Job Codes') + ':',
				itemId: 'expandableJobCodes',
				values: jobcodes
			});
		}

		// Job Contracts
		if ([24, 25, 26, 27].indexOf(data.rule.wfruletype_id) > -1) {
			if (data.contracts.length) {
				var contract,
					contracts = [];

				for (var key in data.contracts) {
					contract = data.contracts[key].jbcontract_name;
					if (data.contracts[key].jbcontract_desc != '') {
						contract = contract + ' - (' + data.contracts[key].jbcontract_desc + ')';
					}

					contracts.push({ html: contract	});
				}

				details.push({
					xtype: 'shared.ExpandableSection',
					opener: NP.Translator.translate('Job Contracts') + ':',
					itemId: 'expandableJobContracts',
					values: contracts
				});
			}
			else {
				details.push({
					xtype: 'panel',
					items: [
						{
							xtype: 'text',
							text: NP.Translator.translate('Job Contracts') + ': ' + NP.Translator.translate('All')
						}
					]
				});
			}
		}

		// Invoice payment types
		if (data.rule.wfruletype_id == 28) {
			var invoicepaymenttypes = [];

			for (var key in data.invoicepaymenttypes) {
				invoicepaymenttypes.push({ html: data.invoicepaymenttypes[key].invoicepayment_type });
			}

			details.push({
				xtype: 'shared.ExpandableSection',
				opener: NP.Translator.translate('Pay By Types') + ':',
				itemId: 'expandablePaymentTypes',
				values: invoicepaymenttypes
			});
		}

		// Vendors
		if ([6, 16].indexOf(data.rule.wfruletype_id) > -1) {
			var vendors = [];
			for (var key in data.vendors) {
				vendors.push({
					html: data.vendors[key]
				});
			}

			details.push({
				xtype: 'shared.ExpandableSection',
				opener: NP.Translator.translate('Vendors') + ':',
				itemId: 'expandableVendors',
				values: vendors
			});
		}

		return [
			{
				xtype: 'panel',
				layout: {
					type: 'vbox',
					pack: 'start'
				},
				border: false,
				defaults: {
					border: 0
				},
				items: details
			}
		];
	},

	sectionRouting: function(data) {
		var originator = '<span class="header-text">Originator</span>';
		var forward = '<span class="header-text">Forward To</span>';

		for (var key in data.routes) {
			originator += '<br>' + data.routes[key].onames;

			if (data.rule.wfruletype_id == 15) {
				forward += '<br>---';
			} else {
				if (data.routes[key].forwards.toLowerCase() == 'next level') {
					forward += '<br> Next Level';
				} else {
					forward += '<br>' + data.routes[key].names;
				}
			}
		}

		return [
			{
				xtype: 'panel',
				layout: {
					type: 'hbox',
					pack: 'start'
				},
				border: false,
				defaults: {
					border: false
				},
				items: [
					{ html: originator },
					{
						html: forward,
						padding: '0 0 0 30'
					}
				]
			}
		];
	}
});