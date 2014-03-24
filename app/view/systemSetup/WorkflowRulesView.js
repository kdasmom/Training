Ext.define('NP.view.systemSetup.WorkflowRulesView', {
	extend: 'Ext.panel.Panel',
	alias:  'widget.systemsetup.workflowrulesview',
	layout: 'fit',

	modal: true,
	autoscroll: true,

	width: 700,
	height: 400,

	bodyStyle: 'background-color: white',
	bodyPadding: 10,

	requires: [
		'NP.view.shared.button.Print',
		'NP.view.shared.button.Cancel',
		'NP.view.shared.button.Edit',

		'NP.view.shared.ExpandableSection'
	],

	initComponent: function() {
		var me = this;

		this.layout = {
			type: 'vbox',
			pack: 'start',
			align: 'stretch'
		};
		this.defaults = {
			border: false
		};

		this.autoScroll = true;

		this.items = [
			{
				xtype: 'panel',
				baseCls: 'header-highlight',
				html: NP.Translator.translate('Workflow Rule - {rulename}', {rulename: this.data.rule.wfrule_name})
			},
			{
				xtype: 'panel',
				layout: {
					type: 'hbox',
					pack: 'start'
				},
				defaults: {
					border: 0
				},
				items: this.sectionType(this.data)
			},
			// Row 3 - Properties
			{
				xtype: 'panel',
				layout: {
					type: 'hbox',
					pack: 'start'
				},
				defaults: {
					border: 0
				},
				items: this.sectionProperties(this.data)
			}
		];

		// Row 4 - Details
		var showDetails =
			this.data.rule.wfruletype_id &&
			this.data.rule.wfruletype_id != 15 &&
			this.data.rule.wfruletype_name.indexOf('delegation') == -1
		;
		showDetails && 
			this.items.push(
				{
					xtype: 'panel',
					layout: {
						type: 'hbox',
						pack: 'start'
					},
					defaults: {
						border: 0
					},
					items: this.sectionDetails(this.data)
				}
			)
		;

		// Row 5 - Routing
		var showRouting =
			this.data.rule.wfruletype_id &&
			this.data.rule.wfruletype_id != 4
		;
		showRouting && 
			this.items.push(
				{
					xtype: 'panel',
					layout: {
						type: 'hbox',
						pack: 'start'
					},
					defaults: {
						border: 0
					},
					items: this.sectionRouting(this.data)
				}
			)
		;

		this.tbar = [
			{ xtype: 'shared.button.cancel', itemId: 'buttonWorkflowBackToMain' },
			{ xtype: 'shared.button.edit',   itemId: 'buttonWorkflowEditRule' },
			{ xtype: 'shared.button.print',  itemId: 'buttonWorkflowPrint' },
		]

		this.callParent(arguments);
	},

	sectionType: function(data) {
		return [
			{
				width: 200,
				cls: 'header-text',
				html: NP.Translator.translate('Rule Type')
			},
			{
				html: data.rule.wfruletype_name
			}
		];
	},

	sectionProperties: function(data) {
		var properties = [];
		for (var key in data.properties.properties) {
			properties.push({
				html: 
					data.properties.properties[key].region_name
					+ ' - ' +
					data.properties.properties[key].property_name
			});
		}

		return [
			{
				width: 200,
				xtype: 'panel',
				cls: 'header-text',
				html: NP.Translator.translate('Applied to Properties') + ':'
			},
			{
				xtype: 'shared.ExpandableSection',
				opener:
					data.properties.all ?
						NP.Translator.translate('ALL Properties') :
						NP.Translator.translate('SPECIFIC Properties')
				,
				itemId: 'expandableProperties',
				values: properties
			}
		];
	},

	sectionDetails: function(data) {
		var details = [];

		if (data.rule.wfruletype_id == 5 || data.rule.wfruletype_id == 12) {
			details.push({
				xtype: 'panel',
				items: [
					{
						xtype: 'text',
						text: NP.Translator.translate('Email Frequency') + ':'
					}
				]
			});
//TODO: Цикл по rule hours и трехколоночная таблица с часами

			details.push({
				xtype: 'panel',
				items: [
					{
						xtype: 'text',
						text: NP.Translator.translate('Email Suppression') + ':'
					}
				]
			});

			var supression = data.rule.wfrule_number || 0;
			switch (supression) {
				case 0:
					supression = NP.Translator.translate('Never Suppress Email');
					break;
				case 1:
					supression = NP.Translator.translate('Suppress Email for the rest of the period');
					break;
				default:
					supression = NP.Translator.translate('Suppress Email for {supression} hours', {supression: supression});
			}

			details.push({
				xtype: 'panel',
				items: [
					{
						xtype: 'text',
						text: supression
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
					description += data.rule.wfrule_number_end + ' ';
				}
			} else if (wfrule_string == 'percentage') {
				description += data.rule.wfrule_number;
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
			for (var key in data.codes) {
				codes.push({
					html:
						data.codes[key].integration_package_name + ' - ' + 
							data.codes[key].glaccount_name + 
							' (' + data.codes[key].glaccount_number + ')'
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
			var units = [];
			for (var key in data.units) {
				var value =
					data.units[key].unitcode ?
						data.units[key].unit_id_alt.toUpperCase() + ' - ' :
						data.units[key].building_id_alt.toUpperCase() + ' - '
				;
				value += data.units[key].unit_number;

				units.push({html: value});
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
							data.categories[key].glaccount_name + 
							' (' + data.categories[key].glaccount_number + ')'
				});
			}

			details.push({
				xtype: 'shared.ExpandableSection',
				opener: NP.Translator.translate('GL Categories') + ':',
				itemId: 'expandableGLCategories',
				values: categories
			});
		}

		// Job Contracts
		if ([24, 25, 26, 27].indexOf(data.rule.wfruletype_id) > -1) {
			var contracts = [];
			for (var key in data.contracts) {
				contracts.push({
					html:
						data.contracts[key].jbcontract_name + ' - ' + 
							'(' + data.contracts[key].jbcontract_desc + ')'
				});
			}

			details.push({
				xtype: 'shared.ExpandableSection',
				opener: NP.Translator.translate('Job Contracts') + ':',
				itemId: 'expandableJobContracts',
				values: contracts
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
				width: 200,
				xtype: 'panel',
				items: [
					{
						xtype: 'text',
						cls: 'header-text',
						text: NP.Translator.translate('Details') + ':'
					}
				]
			},
			{
				xtype: 'panel',
				layout: {
					type: 'vbox',
					pack: 'start'
				},
				defaults: {
					border: 0
				},
				items: details
			}
		]
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

		var routes = [
			{
				xtype: 'panel',
				layout: {
					type: 'hbox',
					pack: 'start'
				},
				defaults: {
					border: 0
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

		return [
			{
				width: 200,
				xtype: 'panel',
				items: [
					{
						xtype: 'text',
						cls: 'header-text',
						text: NP.Translator.translate('Routing') + ':'
					}
				]
			},
			{
				xtype: 'panel',
				layout: {
					type: 'vbox',
					pack: 'start'
				},
				defaults: {
					border: 0
				},
				items: routes
			}
		]
	}
});