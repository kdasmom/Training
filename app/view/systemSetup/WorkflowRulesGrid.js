/**
 * System Setup > Workflow Manager tab > Workflow Rules Grid
 *
 * @author Renat Gatyatov
 */
Ext.define('NP.view.systemSetup.WorkflowRulesGrid', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.workflowrulesgrid',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Translator',
		'NP.view.shared.button.New',
		'NP.view.shared.button.Inactivate',
		'NP.view.shared.button.Activate',
		'NP.lib.ui.Grid',
		'NP.view.systemSetup.gridcol.Name',
		'NP.view.systemSetup.gridcol.RuleType',
		'NP.view.systemSetup.gridcol.Property',
		'NP.view.systemSetup.gridcol.Threshold',
		'NP.view.systemSetup.gridcol.LastUpdated',
		'NP.view.systemSetup.gridcol.Status',
		'NP.view.systemSetup.WorkflowRuleTypeCombo',
		'NP.lib.ui.ComboBox',
		'NP.view.shared.PropertyCombo'
	],

	layout: {
		type : 'vbox',
		align: 'stretch'
	},
	border: false,

	initComponent: function() {
		var me = this;

		var bar = [
			{ xtype: 'shared.button.cancel', itemId: 'buttonWorkflowCancel' },
			{ xtype: 'shared.button.createrule', itemId: 'buttonWorkflowCreateRule' },
			{ xtype: 'shared.button.print', itemId: 'buttonWorkflowPrint' },
			{ xtype: 'shared.button.report', itemId: 'buttonWorkflowReport' }
		];
		this.tbar = bar;

		var filterLabelWidth = 80;
		var filterButtonWidth = 120;
		this.items = [
			{
				xtype: 'panel',
				layout: 'column',
				border: false,
				margin: '0 0 8 0',
				defaults: {
					margin: '0 16 0 16'
				},
				dockedItems: {
					xtype: 'toolbar',
					dock: 'bottom',
					ui: 'footer',
					layout: { pack: 'center' },
					items: [
						{
							xtype: 'button',
							text: NP.Translator.translate('Filter'),
							width: filterButtonWidth,
							handler: Ext.bind(this.applyFilter, this)
						},{
							xtype: 'button',
							text: NP.Translator.translate('Reset'),
							width: filterButtonWidth,
							margin: '0 0 0 5',
							handler: Ext.bind(this.clearFilter, this)
						}
					]
				},
				items: [
					{
						xtype: 'container',
						columnWidth: 0.5,
						layout: 'form',
						items: [
							{
								xtype      : 'systemsetup.workflowruletypecombo',
								labelWidth : filterLabelWidth
							}
						]
					},
					{
						xtype: 'container',
						columnWidth: 0.5,
						layout: 'form',
						items: [
							{
								xtype                : 'shared.propertycombo',
								emptyText            : 'All',
								loadStoreOnFirstQuery: true,
								labelWidth           : filterLabelWidth
							}
						]
					}
				]
			},
			{
				xtype   : 'customgrid',
				border  : false,
				paging  : true,
				flex    : 1,
				selModel: Ext.create('Ext.selection.CheckboxModel'),
				stateful: true,
				stateId : 'workflow_rules_grid',
				store   : Ext.create('NP.store.workflow.Rules', {
					service : 'WFRuleService',
					action  : 'search',
					autoLoad: true,
					paging  : true
				}),
				columns : [
					{ xtype: 'systemsetup.gridcol.name', flex: 2.2 },
					{ xtype: 'systemsetup.gridcol.ruletype', flex: 1.2 },
					{ xtype: 'systemsetup.gridcol.property', flex: 0.5 },
					{ xtype: 'systemsetup.gridcol.threshold', flex: 1.7 },
					{ xtype: 'systemsetup.gridcol.lastupdated', flex: 1.2 },
					{ xtype: 'systemsetup.gridcol.status', flex: 0.4 }
				],
				pagingToolbarButtons: [
					{ xtype: 'shared.button.activate', itemId: 'buttonWorkflowActivateRules', disabled: true },
					{ xtype: 'shared.button.inactivate', itemId: 'buttonWorkflowDeactivateRules', disabled: true, text: NP.Translator.translate('Deactivate') },
					{ xtype: 'shared.button.copy', itemId: 'buttonWorkflowCopyRules', disabled: true },
					{ xtype: 'shared.button.delete', itemId: 'buttonWorkflowDeleteRules', disabled: true }
				]
			}
		];

		this.callParent(arguments);

//		this.statusFilter   = this.query('[name="userprofile_status"]')[0];
//		this.propertyFilter = this.query('[name="property_id"]')[0];
//		this.roleFilter     = this.query('[name="role_id"]')[0];
//		this.moduleFilter   = this.query('[name="module_id"]')[0];
//
//		this.filterFields = ['statusFilter','propertyFilter','roleFilter','moduleFilter'];
	},

	applyFilter: function() {
		var that = this;

		var grid = this.query('customgrid')[0];

		var currentParams = grid.getStore().getProxy().extraParams;
		var newParams = {
			userprofile_status: this.statusFilter.getValue(),
			property_id       : this.propertyFilter.getValue(),
			role_id           : this.roleFilter.getValue(),
			module_id         : this.moduleFilter.getValue()
		};

		Ext.Object.each(newParams, function(key, val) {
			if (currentParams[key] !== newParams[key]) {
				grid.getStore().addExtraParams(newParams);
				grid.reloadFirstPage();

				return false;
			}
		});
	},

	clearFilter: function() {
		var that = this;

		Ext.Array.each(this.filterFields, function(field) {
			that[field].clearValue();
		});

		this.applyFilter();
	}
});

/*
Ext.define('NP.view.systemSetup.WorkflowRulesGrid', {
    extend: 'NP.lib.ui.Grid',
    alias:  'widget.systemsetup.workflowrulesgrid',

    requires: [
        'NP.view.systemSetup.gridcol.Name',
        'NP.view.systemSetup.gridcol.RuleType',
        'NP.view.systemSetup.gridcol.Property',
        'NP.view.systemSetup.gridcol.Threshold',
        'NP.view.systemSetup.gridcol.LastUpdated',
        'NP.view.systemSetup.gridcol.Status'
    ],

    initComponent: function(){
        var me = this;

        this.store = Ext.create('NP.store.workflow.Rules', {
            service : 'WFRuleService',
            action  : 'search',
            paging  : true
        });

        this.columns = [
            { xtype: 'systemsetup.gridcol.name', flex: 2.2 },
            { xtype: 'systemsetup.gridcol.ruletype', flex: 1.2 },
            { xtype: 'systemsetup.gridcol.property', flex: 0.5 },
            { xtype: 'systemsetup.gridcol.threshold', flex: 1.7 },
            { xtype: 'systemsetup.gridcol.lastupdated', flex: 1.2 },
            { xtype: 'systemsetup.gridcol.status', flex: 0.4 }
        ];

        this.paging = true;
		this.selModel = Ext.create('Ext.selection.CheckboxModel', { checkOnly: true, mode: 'MULTI' });

		me.store.load();

        this.callParent(arguments);
    }
});
*/