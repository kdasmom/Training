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
		'NP.view.shared.UserGroupsCombo',
		'NP.view.shared.VendorAutoComplete',
		'NP.view.systemSetup.RuleTypeAutocomplete',
		'Ext.util.Cookies'
	],

	layout: {
		type : 'vbox',
		align: 'stretch'
	},
	border: false,
	autoScroll: true,

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

		this.WFRuleSearchParams = Ext.decode( Ext.util.Cookies.get('WFRuleSearchParams') );

		var gridStore = Ext.create('NP.store.workflow.WfRules', {
			service : 'WFRuleService',
			action  : 'search',
			paging  : true
		});
		gridStore.addExtraParams(this.WFRuleSearchParams);
		gridStore.load();

//		if (this.WFRuleSearchParams) {
//			if (this.WFRuleSearchParams.criteria) {
//					this.WFRuleSearchParams.criteria = this.WFRuleSearchParams.criteria.split(',').map(function(i){
//						return parseInt(i, 10);
//					});
//				}
//		}

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
						},
						{
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
									select: function(field, recs) {
										me.changeCriteriaSection(field.getValue());
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
						items: [{ xtype: 'component', hidden: true }]
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
				store   : gridStore,
				columns : [
					{ xtype: 'systemsetup.gridcol.name', flex: 2.2 },
					{ xtype: 'systemsetup.gridcol.ruletype', flex: 1.2 },
					{ xtype: 'systemsetup.gridcol.property', flex: 0.5, sortable: false },
					{ xtype: 'systemsetup.gridcol.threshold', flex: 1.7, sortable: false },
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

		if (this.WFRuleSearchParams) {
//		if (this.WFRuleSearchParams && this.WFRuleSearchParams.type) {
//			this.changeCriteriaSection( this.WFRuleSearchParams.type, this.WFRuleSearchParams.criteria );
			this.searchtypeFilter.setValue( this.WFRuleSearchParams.type );
		}
	},

	applyFilter: function() {
		var criteriaValue,
			grid = this.query('customgrid')[0],
			currentParams = grid.getStore().getProxy().extraParams,
			criteriaFilter = this.query('[name="criteria"]')[0];

		if (this.query('[name="criteria"]')[0]) {
			criteriaValue = (criteriaFilter.getValue()) ? criteriaFilter.getValue() : null;
		}

		var newParams = {
			type     : this.searchtypeFilter.getValue(),
			criteria : criteriaValue
		};

		Ext.util.Cookies.set('WFRuleSearchParams', Ext.encode(newParams));

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

		this.WFRuleSearchParams = null;

		this.applyFilter();
	},

	changeCriteriaSection: function(searchtype, criteria) {
		var me = this,
			criteriaCombobox;

		criteria = criteria || null;

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
			criteriaCombobox = criteriacontainer.add( criteriaCombobox );
			if (criteria) {
				criteriaCombobox.getStore().load(function() {
					criteriaCombobox.setValue(criteria);
				});
			}
		}
	},

	getStoreListeners: function(searchType) {
		var me = this;

		return {
			load: function() {
				me.query('[name="criteria"]')[0].setValue( me.getDefaultCriteriaValue(searchType) );
			}
		}
	},

	getPropertyCombobox: function() {
		var me = this;

		return {
			xtype                   : 'shared.propertycombo',
			name                    : 'criteria',
//			multiSelect             : true,
			loadStoreOnFirstQuery   : true,
			labelWidth              : this.filterLabelWidth,
			storeAutoLoad           : true,
			storeListeners          : me.getStoreListeners(1)
		}
	},

	getGlAccountCombobox: function() {
        return {
            xtype                   : 'shared.glcombo',
            //multiSelect             : true,
            name                    : 'criteria',
            loadStoreOnFirstQuery   : true,
            labelWidth              : this.filterLabelWidth,
			storeAutoLoad           : true,
			storeListeners          : this.getStoreListeners(2)
        };
	},

	getUserCombobox: function() {
        return {
            xtype                   : 'shared.usercombo',
            //multiSelect             : true,
            name                    : 'criteria',
            valueField              : 'userprofilerole_id',
            loadStoreOnFirstQuery   : true,
            labelWidth              : this.filterLabelWidth,
			storeAutoLoad           : true,
			storeListeners          : this.getStoreListeners(3)
        };
	},

	getUserGroupCombobox: function() {
        return {
            xtype                   : 'shared.usergroupscombo',
            //multiSelect             : true,
            name                    : 'criteria',
			loadStoreOnFirstQuery   : true,
			value   				: this.getDefaultCriteriaValue(4),
            labelWidth              : this.filterLabelWidth
        };
	},

	getVendorCombobox: function() {
        return {
            xtype                   : 'shared.vendorautocomplete',
            //multiSelect             : true,
            name                    : 'criteria',
            loadStoreOnFirstQuery   : true,
			storeAutoLoad           : true,
			storeListeners          : this.getStoreListeners(5),
            labelWidth              : this.filterLabelWidth,
            allowBlank              : true
        }
	},

	getRuleTypeCombobox: function() {
        return {
            xtype                   : 'systemsetup.ruletypeautocomplete',
            //multiSelect             : true,
            typeAhead               : false,
            name                    : 'criteria',
            loadStoreOnFirstQuery   : true,
            labelWidth              : this.filterLabelWidth,
			value   				: this.getDefaultCriteriaValue(6),
            allowBlank              : true
        }
	},

	getDefaultCriteriaValue: function(searchType) {
		var comboboxValue = null;

		if (this.WFRuleSearchParams) {
			if (this.WFRuleSearchParams.type == searchType) {
				comboboxValue = this.WFRuleSearchParams.criteria;
			}
		}

		return comboboxValue;
	}
});