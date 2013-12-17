Ext.define('NP.view.systemSetup.WorkflowRulesMain', {
    extend: 'Ext.panel.Panel',
    alias:  'widget.systemsetup.WorkflowRulesMain',

    title:  'Workflow Management',
    layout: 'fit',

    requires: [
        'NP.view.systemSetup.WorkflowRulesGrid'
    ],

    initComponent: function() {
        this.items = [
            {
                xtype: 'systemsetup.WorkflowRulesGrid'
            }
        ];

        this.tbar = [
            {xtype: 'button', itemId: 'buttonCancel',  text: 'Cancel'},
            {xtype: 'button', itemId: 'buttonCreateRule', text: 'Create Rule'},
        ]

        this.callParent(arguments);
    }
});