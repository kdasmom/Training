Ext.define('NP.view.systemSetup.WorkflowConflictingRulesGrid', {
    extend: 'NP.lib.ui.Grid',
    alias:  'widget.systemsetup.workflowconflictingrulesgrid',

    requires: [
        'NP.view.systemSetup.gridcol.Name',
        'NP.view.systemSetup.gridcol.RuleType',
        'NP.view.systemSetup.gridcol.OriginatesFrom'
    ],

    initComponent: function(){
        var me = this;

//        this.store = Ext.create('NP.store.workflow.Rules', {
//            service : 'WFRuleService',
//            action  : 'search',
//            paging  : true
//        });

        this.columns = [
            { xtype: 'systemsetup.gridcol.name', flex: 2 },
            { xtype: 'systemsetup.gridcol.ruletype', flex: 1 },
            { xtype: 'systemsetup.gridcol.originatesfrom', flex: 2 }
        ];

        this.callParent(arguments);

    }
});