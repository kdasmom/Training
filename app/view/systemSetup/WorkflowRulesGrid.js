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
		'NP.view.systemSetup.WorkflowSearchTypeCombo',
		'NP.lib.ui.ComboBox',
		'NP.view.shared.PropertyCombo',
		'NP.view.shared.GlCombo',
		'NP.view.shared.UserCombo',
		'NP.view.shared.UserGroupsCombo'
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

		this.filterLabelWidth = 80;
		this.filterButtonWidth = 120;

		var gridStore = Ext.create('NP.store.workflow.Rules', {
			service : 'WFRuleService',
			action  : 'search',
			paging  : true
		});
		gridStore.load();

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
							width: me.filterButtonWidth,
							handler: Ext.bind(this.applyFilter, this)
						},{
							xtype: 'button',
							text: NP.Translator.translate('Reset'),
							width: me.filterButtonWidth,
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
								xtype      : 'systemsetup.workflowsearchtypecombo',
								name       : 'searchtype',
								labelWidth : me.filterLabelWidth,
								listeners: {
									change: function(field, newValue, oldValue, options) {
										me.changeCriteriaSection(newValue);
									}
								}
							}
						]
					},
					{
						xtype: 'fieldcontainer',
						name: 'criteriacontainer',
						columnWidth: 0.5,
						layout: 'form',
						items: []
					}
				]
			},
			{
				xtype   : 'customgrid',
				border  : false,
				paging  : true,
				flex    : 1,
				selModel: Ext.create('Ext.selection.CheckboxModel'),
				stateId : 'workflow_rules_grid',
				store   : gridStore,
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

		this.searchtypeFilter = this.query('[name="searchtype"]')[0];
	},

	applyFilter: function() {
		var grid = this.query('customgrid')[0];
		var currentParams = grid.getStore().getProxy().extraParams;

		var criteriaFilter = this.query('[name="criteria"]')[0];

		var newParams = {
			type     : this.searchtypeFilter.getValue(),
			criteria : criteriaFilter ? criteriaFilter.getValue() : null
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
		var me = this;

		me.searchtypeFilter.setValue(0);
		this.query('[name="criteriacontainer"]')[0].removeAll();

		this.applyFilter();
	},

	changeCriteriaSection: function(searchtype) {
		var me = this,
			criteriaCombobox;

		switch (searchtype) {
			case 1:
				criteriaCombobox = me.getPropertyCombobox();
				break;
			case 2:
				criteriaCombobox = me.getGlAccountCombobox();
				break;
			case 3:
				criteriaCombobox = me.getUserCombobox();
				break;
			case 4:
				criteriaCombobox = me.getUserGroupCombobox();
				break;
			case 5:
				criteriaCombobox = me.getVendorCombobox();
				break;
			case 6:
				criteriaCombobox = me.getRuleTypeCombobox();
				break;
		}

		var criteriacontainer = this.query('[name="criteriacontainer"]')[0];
		criteriacontainer.removeAll();

		if (criteriaCombobox) {
			criteriacontainer.add( criteriaCombobox );
		}
	},

	getPropertyCombobox: function() {
		return {
			xtype                   : 'shared.propertycombo',
            multiSelect             : true,
			emptyText               : NP.Translator.translate('All'),
			name                    : 'criteria',
            multiSelect             : true,
			loadStoreOnFirstQuery   : true,
			labelWidth              : this.filterLabelWidth
		}
	},

	getGlAccountCombobox: function() {
        return {
            xtype               : 'shared.glcombo',
            multiSelect         : true,
            emptyText               : NP.Translator.translate('All'),
            name                : 'criteria',
            loadStoreOnFirstQuery   : true,
            labelWidth              : this.filterLabelWidth
        };
	},

	getUserCombobox: function() {
        return {
            xtype                   : 'shared.usercombo',
            multiSelect             : true,
            emptyText               : NP.Translator.translate('All'),
            name                    : 'criteria',
            loadStoreOnFirstQuery   : true,
            labelWidth              : this.filterLabelWidth
        };
	},

	getUserGroupCombobox: function() {

        return {
            xtype                   : 'shared.usergroupscombo',
            multiSelect             : true,
            emptyText               : NP.Translator.translate('All'),
            name                    : 'criteria',
            loadStoreOnFirstQuery   : true,
            labelWidth              : this.filterLabelWidth
        };
//		return {
//			xtype        : 'customcombo',
//			name         : 'criteria',
//			fieldLabel   : NP.Translator.translate('User Group'),
//			emptyText    : NP.Translator.translate('All'),
//			labelWidth   : this.filterLabelWidth,
//			store        : 'user.RoleTree',
//			valueField   : 'role_id',
//			displayField : 'role_name',
//			tpl          :
//			'<tpl for=".">' +
//				'<li class="x-boundlist-item">' +
//					'{indent_text}{role_name}' +
//				'</li>' +
//			'</tpl>'
//		};
	},

	getVendorCombobox: function() {
		var me = this;
//		return;
	},

	getRuleTypeCombobox: function() {
		return {
			xtype: 'customcombo',
			fieldLabel: NP.Translator.translate('Rule Type'),
			name: 'criteria',
			emptyText: NP.Translator.translate('All'),
			store: Ext.create('NP.store.workflow.RuleTypes', {
				service: 'WFRuleService',
				autoLoad: true,
				action: 'listRulesType'
			}),
			labelWidth: this.filterLabelWidth,
			valueField: 'wfruletype_id',
			displayField: 'wfruletype_name'
		};
	}
});