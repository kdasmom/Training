Ext.define('NP.view.systemSetup.WorkflowRulesModify', {
    extend: 'Ext.panel.Panel',
    alias:  'widget.systemsetup.WorkflowRulesModify',

    requires: [
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Copy',
        'NP.view.shared.button.Next',
        'NP.view.shared.button.Back',
        'NP.view.shared.button.SaveAndActivate',

        'NP.view.systemSetup.WorkflowRulesSummary',
        'NP.view.systemSetup.WorkflowRulesBuilderRules',
        'NP.view.systemSetup.WorkflowRulesBuilderRoutes',
		'NP.view.systemSetup.PaymentTypeAssigner'
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
                xtype: 'systemsetup.WorkflowRulesSummary',
                data: me.data,
                margin: '0 0 20 0'
            },
			{
				xtype: 'fieldset',
				title: NP.Translator.translate('Rule Builder'),
				defaultType: 'textfield',
				padding: '8',
				border: true,
				items: [
					{
						xtype: 'systemsetup.WorkflowRulesBuilderRules',
						border: false,
						data: me.data
					},
					{
						xtype: 'systemsetup.WorkflowRulesBuilderRoutes',
						hidden: true
					}
				]
			}
        ];

        me.tbar = me.stepRulesToolbar();
        me.callParent(arguments);
    },

    stepRules: function() {
        var me = this;

		me.down('[xtype="systemsetup.WorkflowRulesBuilderRules"]').show();
		me.down('[xtype="systemsetup.WorkflowRulesBuilderRoutes"]').hide();

        var toolbar = me.getDockedItems()[0];
        toolbar.removeAll();
        toolbar.add(me.stepRulesToolbar());
    },

    stepRoutes: function() {
        var me = this;

        me.down('[xtype="systemsetup.WorkflowRulesBuilderRules"]').hide();
        me.down('[xtype="systemsetup.WorkflowRulesBuilderRoutes"]').show();

        var toolbar = 
            me.getDockedItems()[0]
        ;
        toolbar.removeAll();
        toolbar.add(me.stepRoutesToolbar());
    },

    stepRulesToolbar: function() {
        var me = this;
        return [
            { xtype: 'shared.button.cancel', itemId: 'buttonWorkflowBackToMain' },
            { xtype: 'shared.button.copy', itemId: 'buttonWorkflowCopy' },
            { xtype: 'shared.button.next', itemId: 'buttonWorkflowNext',
                handler: me.stepRoutes.bind(me)
            },
            { xtype: 'shared.button.saveandactivate', itemId: 'buttonSaveAndActivate'}
        ]
    },
    
    stepRoutesToolbar: function() {
        var me = this;
        return [
            { xtype: 'shared.button.cancel', itemId: 'buttonWorkflowBackToMain' },
            { xtype: 'shared.button.back', itemId: 'buttonWorkflowNext',
                handler: me.stepRules.bind(me)
            },
            { xtype: 'shared.button.saveandactivate', itemId: 'buttonSaveAndActivate'},
            { xtype: 'shared.button.copy', itemId: 'buttonWorkflowCopy', text: 'Add Forward' }
        ]
    }
});