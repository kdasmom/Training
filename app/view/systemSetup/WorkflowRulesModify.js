Ext.define('NP.view.systemSetup.WorkflowRulesModify', {
    extend: 'Ext.panel.Panel',
    alias:  'widget.systemsetup.WorkflowRulesModify',

    requires: [
        'NP.view.shared.button.Cancel',
        'NP.view.systemSetup.WorkflowRulesSummary'
    ],

    initComponent: function() {
        var me = this;
        
        this.id = 'card-wizard-panel';
        this.layout = 'card';

        this.activeItem = 0;

        this.items = [
            {
    id: 'card-0',
    items: [
        {
            xtype: 'systemsetup.WorkflowRulesSummary',
            data: this.data
        }
    ]
},{
    id: 'card-1',
    html: 'Step 2'
},{
    id: 'card-2',
    html: 'Step 3'
}
        ];

        this.tbar = [
            '->', 
            {
                id: 'card-prev',
                text: '&laquo; Previous',
                handler: Ext.Function.bind(me.cardNav, this, [-1]),
                disabled: true
            },
            {
                id: 'card-next',
                text: 'Next &raquo;',
                handler: Ext.Function.bind(me.cardNav, this, [1])
            },
            
            
            { xtype: 'shared.button.cancel', itemId: 'buttonWorkflowCancel' },
            // Copy
            // Next Step
            // Save & Activate
        ]
        // Cancel
        // Back
        // Save & Activate
        // Add Forward

        this.callParent(arguments);
    },
    
    
cardNav: function(incr){
        var l = Ext.getCmp('card-wizard-panel').getLayout();
        var i = l.activeItem.id.split('card-')[1];
        var next = parseInt(i, 10) + incr;
        l.setActiveItem(next);
        Ext.getCmp('card-prev').setDisabled(next===0);
        Ext.getCmp('card-next').setDisabled(next===2);
    }
});