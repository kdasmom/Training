Ext.define('NP.view.systemSetup.WorkflowRulesModify', {
	extend: 'Ext.panel.Panel',
	alias:  'widget.systemsetup.workflowrulesmodify',

	requires: [
		'NP.view.shared.button.Cancel',
		'NP.view.shared.button.Copy',
		'NP.view.shared.button.Next',
		'NP.view.shared.button.Back',
		'NP.view.shared.button.SaveAndActivate',
		'NP.view.shared.button.Inactivate',

		'NP.view.systemSetup.WorkflowRulesSummary',
		'NP.view.systemSetup.WorkflowRulesBuilder',
		'NP.view.systemSetup.WorkflowRulesRoutes',
		'NP.view.systemSetup.WorkflowRulesConflicts'
	],

	border: 0,
	autoScroll: true,
	bodyPadding: 10,

	defaults: {
		border: 0
	},

	initComponent: function() {
		var me = this;

		me.items = [
			{
				xtype: 'fieldcontainer',
				name: 'sectionscontainer',
				items: []
			}
		];

		me.tbar = [];
		me.callParent(arguments);

		this.stepRules();
	},


	stepRules: function() {
		var me = this,
			toolbar = me.getDockedItems()[0],
			sectionsContainer = this.down('[name="sectionscontainer"]');

//		Ext.suspendLayouts();

		sectionsContainer.removeAll();
		sectionsContainer.add( me.ruleSummarySection() );
		sectionsContainer.add( me.ruleFormSection() );

		toolbar.removeAll();
		toolbar.add( me.stepRulesToolbar() );

//		Ext.resumeLayouts(true);
	},

	stepRoutes: function() {
		var me = this,
			toolbar = me.getDockedItems()[0],
			sectionsContainer = this.down('[name="sectionscontainer"]');

//		Ext.suspendLayouts();

		sectionsContainer.removeAll();
		sectionsContainer.add( me.ruleSummarySection() );
		sectionsContainer.add( me.routeSection() );

		toolbar.removeAll();
		toolbar.add( me.stepRoutesToolbar() );

//		Ext.resumeLayouts(true);
	},

	stepConflicts: function() {
		var me = this,
			toolbar = me.getDockedItems()[0],
			sectionsContainer = this.down('[name="sectionscontainer"]');

//		Ext.suspendLayouts();

		sectionsContainer.removeAll();
		sectionsContainer.add( me.ruleSummarySection() );
		sectionsContainer.add( me.conflictSection() );

		toolbar.removeAll();
		toolbar.add( me.stepConflictsToolbar() );

//		Ext.resumeLayouts(true);
	},

	stepRulesToolbar: function() {
		var me = this,
			toolbarItems = [];

		if (me.data) {
			toolbarItems.push( {xtype:'shared.button.cancel', itemId:'buttonWorkflowBackToMain'} );
			toolbarItems.push( {xtype:'shared.button.copy', itemId:'buttonWorkflowCopyRule'} );
			toolbarItems.push( {xtype:'shared.button.next', itemId:'buttonWorkflowNext'} );
			toolbarItems.push( {xtype:'shared.button.saveandactivate', itemId:'buttonWorkflowSaveAndActivate'} );
		}
		else {
			toolbarItems.push( {xtype:'shared.button.cancel', itemId:'buttonWorkflowBackToMain'} );
			toolbarItems.push( {xtype:'shared.button.next', itemId:'buttonWorkflowNext'} );
		}

		if (me.data) {
			if (me.data.rule.wfrule_status.toLowerCase() == 'active') {
				toolbarItems.push( {xtype:'shared.button.inactivate', itemId:'buttonWorkflowDeactivateRule', text: NP.Translator.translate('Deactivate')} );
			}
		}

		return toolbarItems;
	},
	
	stepRoutesToolbar: function() {
		var me = this;
		
		return [
			{ xtype: 'shared.button.cancel', itemId: 'buttonWorkflowBackToMain' },
			{ xtype: 'shared.button.back', itemId: 'buttonWorkflowBack', handler: me.stepRules.bind(me) },
			{ xtype: 'shared.button.saveandactivate', itemId: 'buttonSaveAndActivate'},
			{ xtype: 'shared.button.copy', itemId: 'buttonWorkflowAddForward', text: NP.Translator.translate('Add Forward'), disabled:true }
		]
	},

	stepConflictsToolbar: function() {
		var me = this;

		return [
			{ xtype: 'shared.button.cancel', itemId: 'buttonWorkflowBackToMain' },
			{ xtype: 'shared.button.back', itemId: 'buttonWorkflowBack', handler: me.stepRules.bind(me) },
			{ xtype: 'shared.button.next', itemId: 'buttonConflict' }
		]
	},

	ruleSummarySection: function() {
		var me = this;

		return {
			xtype: 'systemsetup.workflowrulessummary',
			data: me.data,
			margin: '0 0 20 0'
		}
	},

	ruleFormSection: function() {
		var me = this;

		return {
			xtype: 'systemsetup.workflowrulesbuilder',
			border: false,
			data: me.data
		}
	},

	routeSection: function() {
		var me = this;

		return {
			xtype: 'systemsetup.workflowrulesroutes',
			border: false,
			data: me.data
		}
	},

	conflictSection: function() {
		var me = this;

		return {
			xtype: 'systemsetup.workflowrulesconflicts',
			border: false,
			data: me.data
		}
	}
});