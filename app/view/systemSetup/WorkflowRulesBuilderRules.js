Ext.define('NP.view.systemSetup.WorkflowRulesBuilderRules', {
    //extend: 'NP.lib.ui.BoundForm',
    extend: 'Ext.panel.Panel',
    alias:  'widget.systemsetup.WorkflowRulesBuilderRules',
    
    requires: [
        'NP.view.shared.PropertyAssigner',
        'NP.view.shared.VendorAssigner',
		'NP.view.systemSetup.BudgetByGlCategoryAssigner',
		'NP.view.systemSetup.BudgetByGlCodeAssigner',
		'NP.view.systemSetup.InvoiceItemAmountAssigner'
    ],

    initComponent: function() {
        var me = this;
        me.autoScroll = true;

        var storeProp = Ext.create('NP.store.property.Properties',{
            service: 'PropertyService',
            action : 'getAll'
        });
        storeProp.load();

        var storeRuleTypes = Ext.create('NP.store.workflow.RuleTypes', {
            service: 'WFRuleService',
            action: 'listRulesType'
        });
        storeRuleTypes.load();

        me.defaults = {
            border: 0
        };

		this.items = [{
			xtype: 'fieldset',
			title: 'Rule Builder',
			defaultType: 'textfield',
			items: [
				// Name
				{
					xtype: 'textfield',
					fieldLabel: 'Name:'
				},
				// Create Rule for
				{
					width: 1200,
					xtype: 'radiogroup',
					fieldLabel: 'Properties',
					//columns: 2,
					items: [
						{
							boxLabel: 'ALL',
							checked: true,
							name: 'propprop',
							listeners: {
								change: function(field, newValue, oldValue, options) {
									if (newValue) {
										me.down('#properties').hide();
									}
								}
							}
						},
						{
							boxLabel: 'SPECIFIC',
							name: 'propprop',
							listeners: {
								change: function(field, newValue, oldValue, options) {
									if (newValue) {
										me.down('#properties').show();
									}
								}
							}
						}
					]
				},
				{
					width: 1200,
					xtype     : 'shared.propertyassigner',
					itemId    : 'properties',
					name      : 'properties',
					store     : storeProp,
					autoScroll: true,
					height    : 200,
					hidden: true,
					fieldLabel: '',
					labelWidth: 200
				},
				// Rule Type
				{
					xtype: 'customcombo',
					fieldLabel: 'Rule Type',
					store: storeRuleTypes,
					valueField: 'wfruletype_id',
					displayField: 'wfruletype_name',
					listeners: {
						change: function(field, value) {
							me.show(value);
						}
					}
				}
				// Amount / Variency
			]
		}];


	    me.items.push(
            this.sectionBudgetByGlCode(),
            this.sectionUnit(),
            this.sectionBudgetByGlCategory(),
            this.sectionVendor(),
            this.sectionJobCode(),
            this.sectionJobContract(),
            this.sectionPayBy(),
            this.sectionEmailSupression(),
            this.sectionLogic()
        );

        me.callParent(arguments);
    },

    sectionUnit: function() {
        return {
            itemId: 'section-unit',
            html: 'section-unit coming soon'
        };
    },

    sectionPayBy: function() {
        return {
            itemId: 'section-payby',
            html: 'section-payby coming soon'
        };
    },

    sectionVendor: function() {
        return {
            itemId: 'section-vendor',
            xtype: 'shared.vendorassigner',

            width: 1200,
            labelWidth: 200,
            height    : 200
        }
    },

    sectionJobCode: function() {
		return {
			itemId: 'section-job-code',
			xtype: 'systemSetup.invoiceitemamountassigner',

			width: 1200,
			labelWidth: 200,
			height    : 200
		};
    },

    sectionJobContract: function() {
        return {
            itemId: 'section-job-contract',
            html: 'section-job-contract coming soon'
        };
    },

    sectionBudgetByGlCode: function() {
		return {
			itemId: 'section-budget',
			xtype: 'systemSetup.budgetbyglcodeassigner',

			width: 1200,
			labelWidth: 200,
			height    : 200
		};
    },

    sectionBudgetByGlCategory: function() {
		return {
			itemId: 'section-budget-category',
			xtype: 'systemSetup.budgetbyglcategoryassigner',

			width: 1200,
			labelWidth: 200,
			height    : 200
		};
    },

    sectionEmailSupression: function() {
        return {
            itemId: 'section-email-supression',
            items: [
                {
                    html: NP.Translator.translate('Email Suppression:')
                },
                {
                    xtype: 'radiogroup',
                    items: [
                        {
                            name: 'email-supression',
                            boxLabel: 'Never Suppress Email'
                        },
                        {
                            name: 'email-supression',
                            boxLabel: 'Suppress Email for ' + '&ltinput value here&gt' +  ' hours'
                        },
                        {
                            name: 'email-supression',
                            boxLabel: 'Suppress Email for the rest of the period'
                        }
                    ]
                }
            ]
        };
    },

    sectionLogic: function() {
        return {
            itemId: 'section-logic',
            items: [
                {
                    itemId: 'logic-title-amount',
                    html: NP.Translator.translate('If total amount is') + ':'
                },
                {
                    itemId: 'logic-title-variance',
                    html: NP.Translator.translate('If variance is') + ':'
                },
                {
                    itemId: 'logic-comparison-1',
                    xtype: 'customcombo',

                    valueField:   'comparison',
                    displayField: 'comparison-title',

                    store: Ext.create('NP.lib.data.Store', {
                        data: [
                            {'comparison': '',                          'comparison-title': ''},
                            {'comparison': 'greater than',              'comparison-title': 'GREATER THAN'},
                            {'comparison': 'greater than or equal to',  'comparison-title': 'GREATER THAN OR EQUAL TO'}
                        ],
                        fields: ['comparison', 'comparison-title']
                    })
                },
                {
                    itemId: 'logic-comparison-2',
                    xtype: 'customcombo',

                    valueField:   'comparison',
                    displayField: 'comparison-title',

                    store: Ext.create('NP.lib.data.Store', {
                        data: [
                            {'comparison': '',                          'comparison-title': ''},
                            {'comparison': 'greater than',              'comparison-title': 'GREATER THAN'},
                        ],
                        fields: ['comparison', 'comparison-title']
                    })
                },
                {
                    itemId: 'logic-comparison-3',
                    xtype: 'customcombo',

                    valueField:   'comparison',
                    displayField: 'comparison-title',

                    store: Ext.create('NP.lib.data.Store', {
                        data: [
                            {'comparison': '',                                   'comparison-title': ''},
                            {'comparison': 'less than',                          'comparison-title': 'LESS THAN'},
                            {'comparison': 'greater than',                       'comparison-title': 'GREATER THAN'},
                            {'comparison': 'greater than or equal to',           'comparison-title': 'GREATER THAN OR EQUAL TO'},
                            {'comparison': 'greater than equal to or less than', 'comparison-title': 'GREATER THAN EQUAL TO OR LESS THAN'}
                        ],
                        fields: ['comparison', 'comparison-title']
                    })
                },
                {
                    itemId: 'logic-comparison-3',
                    xtype: 'customcombo',

                    valueField:   'comparison',
                    displayField: 'comparison-title',

                    store: Ext.create('NP.lib.data.Store', {
                        data: [
                            {'comparison': '',                                   'comparison-title': ''},
                            {'comparison': 'less than',                          'comparison-title': 'LESS THAN'},
                            {'comparison': 'greater than',                       'comparison-title': 'GREATER THAN'},
                            {'comparison': 'greater than or equal to',           'comparison-title': 'GREATER THAN OR EQUAL TO'},
                            {'comparison': 'greater than equal to or less than', 'comparison-title': 'GREATER THAN EQUAL TO OR LESS THAN'},
                            {'comparison': 'greater than or less than',          'comparison-title': 'GREATER THAN OR LESS THAN'}
                        ],
                        fields: ['comparison', 'comparison-title']
                    })
                },
                {
                    itemId: 'logic-comparison-3',
                    xtype: 'customcombo',

                    valueField:   'comparison',
                    displayField: 'comparison-title',

                    store: Ext.create('NP.lib.data.Store', {
                        data: [
                            {'comparison': '',                                   'comparison-title': ''},
                            {'comparison': 'less than',                          'comparison-title': 'LESS THAN'},
                            {'comparison': 'greater than',                       'comparison-title': 'GREATER THAN'},
                            {'comparison': 'greater than or equal to',           'comparison-title': 'GREATER THAN OR EQUAL TO'},
                            {'comparison': 'greater than equal to or less than', 'comparison-title': 'GREATER THAN EQUAL TO OR LESS THAN'},
                            {'comparison': 'greater than or less than',          'comparison-title': 'GREATER THAN OR LESS THAN'},
                            {'comparison': 'in range',                           'comparison-title': 'IN RANGE'}
                        ],
                        fields: ['comparison', 'comparison-title']
                    })
                },

                {
                    itemId: 'logic-comparison-range',
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: 'From:'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'To:'
                        }
                    ]
                },

                {
                    itemId: 'logic-comparison-suffix',
                    items: [
                        {
                            itemId: 'logic-comparison-numbertype',
                            xtype: 'hidden'
                        },
                        {
                            itemId: 'logic-comparison-numbertype-label-1',
                            html: 'Percentage'
                        },
                        {
                            itemId: 'logic-comparison-numbertype-label-2',
                            html: 'the privileges of current user.'
                        }
                    ]
                }
            ]
        };
    },

    hide: function() {
        var sections = [
            '#section-unit',
            '#section-payby',
            '#section-vendor',
            '#section-job-code',
            '#section-job-contract',
            '#section-budget',
            '#section-budget-category',
            '#section-email-supression',
            '#section-logic'
        ];

        var me = this;
        for (var i = 0, l = sections.length; i < l; i++) {
            me.down(sections[i]).hide();
        }
    },

    show: function(type) {
        var me = this;

        me.hide();

        me.showSectionUnit(type);
        me.showSectionPayBy(type);
        me.showSectionVendor(type);
        me.showSectionJobCode(type);
        me.showSectionJobContract(type)
        me.showSectionBudgetByGlCode(type);
        me.showSectionBudgetByGlCategory(type);
        me.showSectionEmailSupression(type);
        me.showSectionLogic(type);

        me.showElementLogicTitle(type);
        me.showElementLogicComparisonRange('<here should be field: frm.wfrule_comparison>');

        switch (type) {
            case 1:
		//setoperators(1,frm);
                break;
            case 2:
                //setoperators(2,frm);
                break;
            case 3:
                //setoperators(3,frm);
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
		//setoperators(6,frm);
                break;
            case 7:
		//setoperators(7,frm);
                break;
            case 8:
		//setoperators(8,frm);
                break;
            case 9:
		//setoperators(9,frm);
                break;
            case 10:
		//setoperators(10,frm);
                break;
            case 11:
		//setoperators(11,frm);
                break;
            case 12:
                break;
            case 13:
		//setoperators(13,frm);
                break;
            case 14:
		//setoperators(14,frm);
                break;
            case 15:
                break;
            case 16:
		//setoperators(16,frm);
                break;
            case 17:
		//setoperators(17,frm);
                break;
            case 18:
		//setoperators(18,frm);
                break;
            case 19:
		//setoperators(19,frm);
                break;
            case 20:
		//setoperators(3,frm);
                break;
            case 21:
		//setoperators(21,frm);
                break;
            case 22:
		//setoperators(22,frm);
                break;
            case 23:
		//setoperators(23,frm);
                break;
            case 24:
                //setoperators(24,frm);
                break;
            case 25:
		//setoperators(25,frm);
                break;
            case 26:
                //setoperators(26,frm);
                break;
            case 27:
		//setoperators(27,frm);
                break;
            case 28:
		//setoperators(28,frm);
                break;
            case 29:
		//setoperators(29,frm);
                break;
            case 30:
		//setoperators(30,frm);
                break;
            case 31:
		//setoperators(31,frm);
                break;
            case 32:
		//setoperators(32,frm);
                break;
            case 33:
		//setoperators(13,frm);
                break;
            case 34:
		//setoperators(14,frm);
                break;
            case 35:
		//setoperators(11,frm);
                break;
            case 36:
		//setoperators(10,frm);
                break;
            case 37:
		//setoperators(8,frm);
                break;
            case 38:
		//setoperators(11,frm);
                break;
            case 50:
		//setoperators(3,frm);
                break;
            default:
		//setoperators(1,frm);
        }
    },

    showSectionUnit: function(type) {
        var correct =
            type >= 35 && type <= 36
        ;
        correct &&
            this.down('#section-unit').show()
        ;
    },

    showSectionPayBy: function(type) {
        var correct =
            type == 28
        ;
        correct &&
            this.down('#section-payby').show()
        ;
    },

    showSectionVendor: function(type) {
        var correct =
            type == 6 ||
            type == 16
        ;
        correct &&
            this.down('#section-vendor').show()
        ;
    },

    showSectionJobCode: function(type) {
        var correct =
            type >= 21 && type <= 22
        ;
        correct &&
            this.down('#section-job-code').show()
        ;
    },

    showSectionJobContract: function(type) {
        var correct =
            type >= 24 && type <= 27
        ;
        correct &&
            this.down('#section-job-contract').show()
        ;
    },

    showSectionBudgetByGlCode: function(type) {
        var correct =
            type == 3 ||
            type >= 7 && type <= 8 ||
            type == 13 ||
            type == 29 ||
            type == 31 ||
            type == 33 ||
            type == 37
        ;
        correct &&
            this.down('#section-budget').show()
        ;
    },

    showSectionBudgetByGlCategory: function(type) {
        var correct =
            type >= 9 && type <= 12 ||
            type == 14 ||
            type == 30 ||
            type == 32 ||
            type == 34 ||
            type == 38
        ;
        correct &&
            this.down('#section-budget-category').show()
        ;
    },

    showSectionEmailSupression: function(type) {
        var correct =
            type == 5 ||
            type == 12
        ;
        correct &&
            this.down('#section-email-supression').show()
        ;
    },

    showSectionLogic: function(type) {
        var correct =
            type >= 1 && type <= 3 ||
            type >= 6 && type <= 11 ||
            type >= 13 && type <= 14 ||
            type >= 16 && type <= 38 ||
            type >= 50
        ;
        correct &&
            this.down('#section-logic').show()
        ;
    },

    showElementLogicTitle: function(type) {
        var me = this;

        var correct =
            type == 3 ||
            type == 9 ||
            type >= 13 && type <= 14 ||
            type >= 29 && type <= 34
        ;
        if (correct) {
            me.down('#logic-title-amount').hide();
            me.down('#logic-title-variance').show();
        }

        correct =
            type >= 35 && type <= 36
        ;
        if (correct) {
            me.down('#logic-title-amount').show();
            me.down('#logic-title-variance').hide();
        }
    },

    showElementLogicComparisonRange: function(value) {
        var me = this;
        if (value == 'in range') {
            me.down('logic-comparison-range').show();
        } else {
            me.down('logic-comparison-range').hide();
        }
    }
});

/* utility function to change the operator options for number comparison dependent on rule type selected * /
function setoperators(rt,frm){
	var fld = frm.wfrule_comparison;
	fld.options.length = 0;

	fld.options[0] = new Option("","");
	if(rt == 17 || rt == 18){
		for (i=0; i<op2.length; i++){
			fld.options[i+1] = new Option(op2[i].toUpperCase(),op2[i].toLowerCase());
		}
	}else if(rt == 19){
		for (i=0; i<op1.length; i++){
			fld.options[i+1] = new Option(op1[i].toUpperCase(),op1[i].toLowerCase());
		}
	}else if(rt == 29 || rt == 30 || rt == 31 || rt == 32){
		for (i=0; i<op4.length; i++){
			fld.options[i+1] = new Option(op4[i].toUpperCase(),op4[i].toLowerCase());
		}
	}else {
		for (i=0; i<op3.length; i++){
			fld.options[i+1] = new Option(op3[i].toUpperCase(),op3[i].toLowerCase());
		}
		if (rt == 1 || rt == 2 || rt == 7 || rt == 8 || rt == 10 || rt == 11 || rt == 21 || rt == 22 || rt == 23  || rt == 28 || rt == 37 || rt == 38){
			fld.options[fld.options.length] = new Option("IN RANGE", "in range");
		}else if (rt == 4){
			fld.options[fld.options.length] = new Option("GREATER THAN OR LESS THAN", "greater than or less than");
		}
	}
	
	//now set the operator label
	lbl = document.getElementById("numbertypelabel");
	if(rt == 17 || rt == 29 || rt == 30 || rt == 31 || rt == 32){
		lbl.innerHTML = "Percentage";
	}else if(rt != 4){
		lbl.innerHTML = "";
	}else {
		lbl.innerHTML = "the privileges of current user.";
	}
	//and finally select the appropriate option
	for(i=0; i<fld.options.length; i++){
		if(fld.options[i].value == '<cfoutput>#get_rule.wfrule_operand#</cfoutput>'){
			fld.selectedIndex = i;
		}
	}
}
*/
