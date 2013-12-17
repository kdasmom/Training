Ext.define('NP.view.systemSetup.WorkflowRulesGrid', {
    extend: 'NP.lib.ui.Grid',
    alias:  'widget.systemsetup.WorkflowRulesGrid',

    initComponent: function(){
        this.store = Ext.create('NP.store.workflow.Rules', {
            service : 'WFRuleService',
            action  : 'search',
            paging  : true
        });

        this.columns = [
            {
                text     : 'Name',
                dataIndex: 'wfrule_name',
                flex     : 5
            },
            {
                text     : 'Applied To',
                dataIndex: 'wfruletype_name',
                flex     : 5
            },
            {
                text     : 'Last updated',
                dataIndex: 'userprofile_username',
                flex     : 5
            },
            {
                text     : 'Status',
                dataIndex: 'wfrule_status',
                flex     : 5
            }
        ];

        this.paging = true;

        this.selType = 
            'checkboxmodel'
        ;
        this.selModel = {
            mode: 'MULTI',
            checkOnly: true
        };

        this.callParent(arguments);
    }
});