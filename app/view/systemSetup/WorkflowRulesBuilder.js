Ext.define('NP.view.systemSetup.WorkflowRulesBuilder', {
	extend: 'Ext.panel.Panel',
	alias:  'widget.systemsetup.workflowrulesbuilder',
	
	requires: [
		'Ext.form.FieldSet',
		'NP.view.shared.PropertyAssigner',
		'NP.view.shared.VendorAssigner',
		'NP.view.systemSetup.BudgetByGlCategoryAssigner',
		'NP.view.systemSetup.BudgetByGlCodeAssigner',
		'NP.view.systemSetup.InvoiceItemAmountAssigner',
		'NP.view.systemSetup.ContractAssigner',
		'NP.view.systemSetup.PaymentTypeAssigner',
		'NP.view.systemSetup.UnitAssigner',
		'NP.store.invoice.InvoicePaymentTypes'
	],

	initComponent: function() {
		var me = this,
			ruletype = null,
			allProperties = false;

		me.autoScroll = true;
		me.defaults = {
			border: 0
		};

		if (me.data) {
			ruletype = me.data.rule.wfruletype_id;
			allProperties = me.data.allProperties;
		}

		var storeRuleTypes = Ext.create('NP.store.workflow.WfRuleTypes', {
			service: 'WFRuleService',
			action: 'listRulesType'
		});
		storeRuleTypes.load();

		this.items = [{
			xtype: 'fieldset',
			title: NP.Translator.translate('Rule Builder'),
			defaultType: 'textfield',
			padding: '8',
			border: true,
			items: [{
				xtype: 'form',
				name: 'ruleform',
				itemId: 'ruleform',
				border: 0,
				items: [
					{
						xtype: 'hiddenfield',
						name : 'wfrule_id',
						value: me.data ? me.data.rule.wfrule_id : null
					},
					{
						xtype: 'textfield',
						fieldLabel: NP.Translator.translate('Rule Name'),
						name: 'name',
						labelWidth: 200,
						width: 687,
						value: me.data ? me.data.rule.wfrule_name : '',
						allowBlank: false
					},
					{
						xtype: 'radiogroup',
						fieldLabel: NP.Translator.translate('Properties'),
						layout: 'hbox',
						labelWidth: 200,
						width: 400,
						listeners: {
							change: function(field, newValue, oldValue, options) {
								var propertiescontainer = me.down('[name="ruleform"]').down('[name="propertiescontainer"]');
								propertiescontainer.removeAll();

								if (newValue.all_properties != '1') {
									propertiescontainer.add( me.getPropertiesSection() );
									me.down('[name="ruleform"]').down('[name="properties"]').setValue([]);
								}
							}
						},
						items: [
							{
								boxLabel: NP.Translator.translate('ALL'),
								checked: allProperties,
								name: 'all_properties',
								inputValue: '1'
							},
							{
								boxLabel: NP.Translator.translate('SPECIFIC'),
								name: 'all_properties',
								inputValue: '0',
								padding: '0 0 0 20',
								checked: !allProperties
							}
						]
					},
					{
						xtype: 'fieldcontainer',
						name: 'propertiescontainer',
						items: []
					},
					{
						xtype: 'customcombo',
						fieldLabel: NP.Translator.translate('Rule Type'),
						name: 'ruletypeid',
						allowBlank: false,
						store: storeRuleTypes,
						labelWidth: 200,
						width: 687,
						valueField: 'wfruletype_id',
						displayField: 'wfruletype_name',
						value: ruletype,
						listeners: {
							select: function(field, recs) {
								me.addRuleTypeFields(field.getValue());

								var ruleTypeOperand = (me.data) ? me.data.rule.wfrule_operand : '';
								me.addSectionLogicOption(ruleTypeOperand);
							}
						}
					},
					{
						xtype: 'fieldcontainer',
						name: 'ruletype_options',
						layout: 'vbox',
						items: []
					}
				]
			}]
		}];

		me.callParent(arguments);

		this.addRuleTypeFields(ruletype);

		if (!allProperties) {
			var propertiescontainer = me.down('[name="ruleform"]').down('[name="propertiescontainer"]');
			propertiescontainer.add( me.getPropertiesSection() );
		}

		if (me.data) {
			if (this.down('[name="ruleform"]').down('[name="properties"]')) {
				this.down('[name="ruleform"]').down('[name="properties"]').setValue( me.data.property_list_id );
			}
			if (this.down('[name="ruleform"]').down('[name="tablekeys"]')) {
				this.down('[name="ruleform"]').down('[name="tablekeys"]').setValue( me.data.tablekey_list_id );
			}
		}

		var ruleTypeOperand = (me.data) ? me.data.rule.wfrule_operand : '';
		me.addSectionLogicOption(ruleTypeOperand);
	},

	addRuleTypeOptions: function(ruletype) {
		var options = [];

		switch (ruletype) {
			case 1:  // Purchase Order total amount
			case 2:  // Invoice total amount
			case 4:  // Delegation
			case 15: // Optional Workflow
			case 17: // Vendor Estimate to Invoice Conversion Threshold (Percentage Variance) - Master Rule
			case 18: // Vendor Estimate to Invoice Conversion Threshold (Total Dollar Amount) - Master Rule
			case 19: // Vendor Estimate to Invoice Conversion Threshold (Dollar Variance) - Master Rule
			case 20: // Converted Invoices – Master
			case 23: // Receipt Total Amount
				break;

			case 3:  // Budget amount (by GL code)
			case 7:  // Invoice Item amount (by GL code)
			case 8:  // Purchase Order Item Total (by GL code)
			case 13: // Yearly Budget amount (by GL Code)
				options.push( this.getSectionBudgetByGlCode() );
				break;

			case 5:  // Approval Notification Email
				Ext.suspendLayouts();
				options.push( this.getSectionEmail() );
				Ext.resumeLayouts(true);
				break;

			case 12: //Budget Overage Notification Email
				options.push( this.getSectionBudgetByGlCategory() );
				options.push( this.getSectionEmail() );
				break;

			case 29: // YTD Budget % Overage (by GL Code)
			case 31: // MTD Budget % Overage (by GL Code)
			case 33: // YTD Budget Overage (by GL Code)
			case 37: // Receipt Item Total (by GL Code)
				options.push( this.getSectionBudgetByGlCode() );
				break;

			case 9:  // Budget amount (by GL category)
			case 10: // Invoice Item amount (by GL category)
			case 11: // Purchase Order Item Total (by GL category)
			case 14: // Yearly Budget amount (by GL Category)
			case 30: // YTD Budget % Overage (by GL Category)
			case 32: // MTD Budget % Overage (by GL Category)
			case 34: // YTD Budget Overage (by GL Category)
			case 38: // Receipt Item Total (by GL Category)
				options.push( this.getSectionBudgetByGlCategory() );
				break;

			case 6:  // Specific Vendor
			case 16: // Specific Vendor - Master Rule
				options.push( this.getSectionVendor() );
				break;

			case 21: // Invoice Item amount (by Job Code)
			case 22: // Purchase Order Item Total (by Job Code)
				options.push( this.getSectionJobCode() );

				break;
			case 24: // Invoice Item Amount (by Contract Code)
			case 25: // Purchase Order Item Amount (by Contract Code)
			case 26: // Invoice Item Amount (by Contract Code) - Master
			case 27: // Purchase Order Item Amount (by Contract Code) - Master
				options = this.getSectionJobContract();
				break;

			case 28: // Invoice Total by Pay By - Master Rule
				options.push( this.getSectionPayBy() );
				break;

			case 35: // PO Item Amount by Department
			case 36: // Invoice Item Amount by Department
				options.push( this.getSectionUnit() );
				break;
		}

		return options;
	},


	addSectionLogic: function(ruletype) {
		var sectionLogic,
			fieldtitle;

		if (Ext.Array.contains([3,4,5,7,8,9,12,13,14,15,29,30,31,32,33,34], ruletype)) {
			fieldtitle = NP.Translator.translate('If variance is');
		} else {
			fieldtitle = NP.Translator.translate('If total amount is');
		}

		switch (ruletype) {
			case 1:  // Purchase Order total amount
			case 2:  // Invoice total amount
			case 3:  // Budget amount (by GL code)
			case 6:  // Specific Vendor
			case 7:  // InSpecific Vendor - Master Rulevoice Item amount (by GL code)
			case 8:  // Purchase Order Item Total (by GL code)
			case 9:  // Budget amount (by GL category)
			case 10: // Invoice Item amount (by GL category)
			case 11: // Purchase Order Item Total (by GL category)
			case 13: // Yearly Budget amount (by GL Code)
			case 14: // Yearly Budget amount (by GL Category)
			case 16: // Specific Vendor - Master Rule
			case 20: // Converted Invoices – Master
			case 21: // Invoice Item amount (by Job Code)
			case 22: // Purchase Order Item Total (by Job Code)
			case 23: // Receipt Total Amount
			case 24: // Invoice Item Amount (by Contract Code)
			case 25: // Purchase Order Item Amount (by Contract Code)
			case 26: // Invoice Item Amount (by Contract Code) - Master
			case 27: // Purchase Order Item Amount (by Contract Code) - Master
			case 28: // Invoice Total by Pay By - Master Rule
			case 33: // YTD Budget Overage (by GL Code)
			case 34: // YTD Budget Overage (by GL Category)
			case 35: // PO Item Amount by Department
			case 36: // Invoice Item Amount by Department
			case 37: // Receipt Item Total (by GL Code)
			case 38: // Receipt Item Total (by GL Category)
				sectionLogic = this.getSectionLogic(fieldtitle, ['less', 'greater', 'greater_equal', 'greater_equal_or_less', 'in_range']);
				break;

			case 17: // Vendor Estimate to Invoice Conversion Threshold (Percentage Variance) - Master Rule
			case 18: // Vendor Estimate to Invoice Conversion Threshold (Total Dollar Amount) - Master Rule
			case 19: // Vendor Estimate to Invoice Conversion Threshold (Dollar Variance) - Master Rule
				sectionLogic = this.getSectionLogic(fieldtitle, ['greater', 'greater_equal', 'in_range']);
				break;

			case 29: // YTD Budget % Overage (by GL Coxde)
			case 31: // MTD Budget % Overage (by GL Code)
			case 30: // YTD Budget % Overage (by GL Category)
			case 32: // MTD Budget % Overage (by GL Category)
				sectionLogic = this.getSectionLogic(fieldtitle, ['less', 'greater', 'greater_equal', 'in_range']);
				break;

			case 4:  // Delegation
			case 5:  // Approval Notification Email
			case 12: // Budget Overage Notification Email
			case 15: // Optional Workflow
				break;
		}

		return sectionLogic;
	},

	addRuleTypeFields: function(ruletype) {
		var ruleTypeOptions = this.down('[name="ruleform"]').down('[name="ruletype_options"]');

		Ext.suspendLayouts();

		ruleTypeOptions.removeAll();

		var options = this.addRuleTypeOptions(ruletype);
		for (var i in options) {
			ruleTypeOptions.add(options[i]);
		}

		var logicSection = this.addSectionLogic(ruletype);
		if (logicSection) {
			ruleTypeOptions.add(logicSection);
		}

		Ext.resumeLayouts(true);
	},

	getPropertiesSection: function() {
		return {
			width: 994,
			xtype: 'shared.propertyassigner',
			itemId: 'properties',
			name: 'properties',
			autoScroll: true,
			allowBlank: false,
			height: 200,
			margin: '0 0 10 205',
			fieldLabel: '',
			labelWidth: 200
		}
	},

	getSectionUnit: function() {
		var unitStore = Ext.create('NP.lib.data.Store', {
			service	 : 'WFRuleService',
			action	 : 'getUnits',
			fields	 : ['property_name', 'unit_id', 'unit_display']
		});
		unitStore.load();

		return {
			itemId: 'section-unit',
			xtype: 'systemSetup.unitassigner',
			name: 'tablekeys',
			autoLoad: false,
			allowBlank: false,
			width: 1200,
			labelWidth: 200,
			store: unitStore,
			height: 200
		};
	},

	getSectionPayBy: function() {
		var paymentTypeStore = Ext.create('NP.store.invoice.InvoicePaymentTypes', {
			service     : 'InvoiceService',
			action      : 'getPaymentTypes',
			fields	    : ['invoicepayment_type_id', 'invoicepayment_type'],
			extraParams : {
				paymentType_id: null
			}
		});
		paymentTypeStore.load();

		return {
			itemId: 'section-payby',
			xtype: 'systemSetup.paymenttypeassigner',
			name: 'tablekeys',
			autoLoad: false,
			allowBlank: false,
			width: 1200,
			labelWidth: 200,
			height: 200,
			store: paymentTypeStore
		};
	},

	getSectionVendor: function() {
		var vendorStore = Ext.create('NP.store.vendor.Vendors', {
			service	: 'VendorService',
			action	: 'getAll',
			fields	: ['vendor_id', 'vendor_name', 'vendor_id_alt']
		});
		vendorStore.load();

		return {
			itemId: 'section-vendor',
			xtype: 'shared.vendorassigner',
			name: 'tablekeys',
			autoLoad: false,
			allowBlank: false,
			width: 1200,
			store: vendorStore,
			labelWidth: 200,
			height: 200
		}
	},

	getSectionJobCode: function() {
		var jobCodeStore = Ext.create('NP.lib.data.Store', {
			service	: 'JobCostingService',
			action	: 'getJobCodes',
			fields	: ['jbjobcode_id', 'jbjobcode_desc', 'jbjobcode_name'],
			extraParams: {
				status: 'active'
			}
		});
		jobCodeStore.load();

		return {
			itemId: 'section-job-code',
			xtype: 'systemSetup.invoiceitemamountassigner',
			name: 'tablekeys',
			autoLoad: false,
			allowBlank: false,
			store: jobCodeStore,
			width: 1200,
			labelWidth: 200,
			height: 200
		};
	},

	getSectionJobContract: function() {
		var me = this;

		var contractsStore = Ext.create('NP.lib.data.Store', {
			service	: 'JobCostingService',
			action	: 'getContracts',
			fields	: ['jbcontract_id', 'jbcontract_desc', 'jbcontract_name'],
			extraParams: {
				status: 'active'
			}
		});
		contractsStore.load();

		var allContracts = false;
		if (me.data.tablekey_list_id.length == 1) {
			allContracts = (me.data.tablekey_list_id[0]) ? false : true;
		}

		return [
			{
				xtype: 'radiogroup',
				layout: 'hbox',
				margin: '10 0 10 205',
				listeners: {
					change: function(field, newValue, oldValue, options) {
						var fn = (newValue.AllContracts) ? 'hide' : 'show';

						me.down('#section-job-contract')[fn]();

						me.down('#section-job-contract').allowBlank = (newValue.AllContracts) ? true : false;
					}
				},
				items: [
					{
						boxLabel: NP.Translator.translate('All Contracts'),
						checked: allContracts,
						name: 'AllContracts',
						inputValue: 1
					},
					{
						boxLabel: NP.Translator.translate('Specific Contracts'),
						name: 'AllContracts',
						inputValue: 0,
						padding: '0 0 0 20',
						checked: !allContracts
					}
				]
			},
			{
				itemId: 'section-job-contract',
				xtype: 'systemSetup.contractassigner',
				fieldLabel: NP.Translator.translate('Invoice Item Amount (by Contract)'),
				name: 'tablekeys',
				autoLoad: false,
				allowBlank: allContracts,
				hidden: allContracts,
				store: contractsStore,
				width: 1200,
				labelWidth: 200,
				height: 200
			}
		];
	},

	getSectionBudgetByGlCode: function() {
		var GLCodestore = Ext.create('NP.lib.data.Store', {
			service	: 'GLService',
			action	: 'getBudgetAmountByGlCode',
			fields	: ['glaccount_id', 'glaccount_name', 'glaccount_number'],
			extraParams: {
				sort: NP.Config.getSetting('PN.Budget.GLCodeSort')
			}
		});
		GLCodestore.load();

		return {
			itemId: 'section-budget',
			xtype: 'systemSetup.budgetbyglcodeassigner',
			name: 'tablekeys',
			autoLoad: false,
			allowBlank: false,
			store: GLCodestore,
			width: 1200,
			labelWidth: 200,
			height	: 200
		};
	},

	getSectionBudgetByGlCategory: function() {
		var GLCategoryStore = Ext.create('NP.lib.data.Store', {
			service	 : 'GLService',
			action	 : 'getBudgetAmountByGlCategory',
			fields	 : ['glaccount_id', 'glaccount_name', 'glaccount_number'],
		});
		GLCategoryStore.load();

		return {
			itemId: 'section-budget-category',
			xtype: 'systemSetup.budgetbyglcategoryassigner',
			name: 'tablekeys',
			autoLoad: false,
			allowBlank: false,
			store: GLCategoryStore,
			width: 1200,
			labelWidth: 200,
			height: 200
		};
	},

	getSectionEmail: function() {
		var me = this,
			emailSupression = '',
			wfruleNumber = '0';

		if (me.data) {
			emailSupression = (me.data.rule.runhour != null) ? me.data.rule.runhour : '';
			if (Ext.Array.contains([5, 12], me.data.rule.wfruletype_id)) {
				wfruleNumber = me.data.rule.wfrule_number;
			}
		}

		return {
			itemId: 'section-email',
			border: false,
			items: [
				{
					xtype: 'radiogroup',
					fieldLabel: NP.Translator.translate('Email Suppression'),
					labelWidth: 200,
					layout: 'vbox',
					items: [
						{
							name: 'comparisonValue',
							boxLabel: NP.Translator.translate('Never Suppress Email'),
							inputValue: '0',
							checked: (wfruleNumber == '0')
						},
						{
							name: 'comparisonValue',
							inputValue: 'suppression_hours',
							boxLabel: NP.Translator.translate(
										'Suppress Email for {supression} hours',
										{ supression : '<input id="email_suppression_hours" value="' + emailSupression + '" type="text" style="width:70px;" />' }
									  ),
							checked: !Ext.Array.contains(['-1','0'], wfruleNumber)
						},
						{
							name: 'comparisonValue',
							inputValue: '-1',
							boxLabel: NP.Translator.translate('Suppress Email for the rest of the period'),
							checked: (wfruleNumber == '-1')
						}
					],
					listeners: {
						render: function() {
							new Ext.form.TextField({
								name: 'email_suppression_hours',
								applyTo: 'email_suppression_hours'
							});
						}
					}
				}
			]
		};
	},

	getSelectOption: function(value) {
		var option;

		switch(value) {
			case 'less':
				option = {'comparison': 'less than', 'comparison-title': NP.Translator.translate('LESS THAN')};
				break;
			case 'greater':
				option = {'comparison': 'greater than', 'comparison-title': NP.Translator.translate('GREATER THAN')};
				break;
			case 'greater_equal':
				option = {'comparison': 'greater than or equal to', 'comparison-title': NP.Translator.translate('GREATER THAN OR EQUAL TO')};
				break;
			case 'greater_equal_or_less':
				option = {'comparison': 'greater than equal to or less than', 'comparison-title': NP.Translator.translate('GREATER THAN EQUAL TO OR LESS THAN')};
				break;
			case 'in_range':
				option = {'comparison': 'in range', 'comparison-title': NP.Translator.translate('IN RANGE')};
				break;
		}

		return option;
	},


	getSectionLogic: function(sectionname, values) {
		var me = this,
			sectionStore = [];

		for (i in values) {
			var selectOption = this.getSelectOption(values[i]);

			if (selectOption) {
				sectionStore.push(selectOption);
			}
		}

		sectionStore.unshift( {'comparison': '', 'comparison-title': ''} );

		var section = {
			itemId: 'section-logic',
			border: 0,
			xtype: 'fieldcontainer',
			layout: 'hbox',
			items: [
				{
					fieldLabel: sectionname,
					labelWidth: 200,
					width: 687,
					itemId: 'logic-comparison',
					xtype: 'customcombo',
					name: 'comparison',
					valueField: 'comparison',
					displayField: 'comparison-title',
					allowBlank: false,
					value: me.data ? me.data.rule.wfrule_operand : '',
					store: Ext.create('NP.lib.data.Store', {
						data: sectionStore,
						fields: ['comparison', 'comparison-title']
					}),
					listeners: {
						select: function(field, recs) {
							me.addSectionLogicOption(field.getValue());
						}
					}
				},
				{
					xtype: 'fieldcontainer',
					name: 'section-logic-option',
					layout: 'hbox',
					items: []
				}
			]
		};



		return section;
	},

	addSectionLogicOption: function(value) {
		var me                    = this,
			sectionLogicOption,
			wfrule_number         = '',
			wfrule_number_end     = '',
			sectionLogicContainer = this.down('[name="ruleform"]').down('[name="section-logic-option"]');

		if (me.data) {
			if (me.data.rule.wfrule_operand) {
				wfrule_number = me.data.rule.wfrule_number;
				wfrule_number_end = me.data.rule.wfrule_number_end;
			}
		}

		switch (value) {
			case 'in range':
				sectionLogicOption = {
					itemId: 'section-logic',
					border: 0,
					margin: '0 0 0 30',
					xtype : 'fieldcontainer',
					layout: 'hbox',
					items : [
						{
							xtype     : 'numberfield',
							fieldLabel: NP.Translator.translate('From'),
							name      : 'comparisonValue',
							labelWidth: 40,
							width     : 200,
							allowBlank: false,
							value     : wfrule_number
						},
						{
							xtype     : 'numberfield',
							fieldLabel: NP.Translator.translate('To'),
							name      : 'comparisonValueTo',
							margin    : '0 0 0 20',
							labelWidth: 25,
							width     : 200,
							allowBlank: false,
							value     : wfrule_number_end
						}
					]
				};
				break;
			default:
				sectionLogicOption = {
					xtype     : 'numberfield',
					margin    : '0 0 0 30',
					fieldLabel: '',
					name      : 'comparisonValue',
					allowBlank: false,
					value     : wfrule_number
				};
		}

		if (sectionLogicContainer) {
			var currentLogicOption = sectionLogicContainer.down();
			if (!currentLogicOption || currentLogicOption.getXType() !== sectionLogicOption.xtype) {
				Ext.suspendLayouts();

				sectionLogicContainer.removeAll();
				sectionLogicContainer.add(sectionLogicOption);

				Ext.resumeLayouts(true);
			}
		}
	}
});