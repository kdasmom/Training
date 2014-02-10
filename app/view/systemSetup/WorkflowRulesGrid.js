Ext.define('NP.view.systemSetup.WorkflowRulesGrid', {
    extend: 'NP.lib.ui.Grid',
    alias:  'widget.systemsetup.WorkflowRulesGrid',

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

        this.selType = 
            'checkboxmodel'
        ;
        this.selModel = {
            mode: 'MULTI',
            checkOnly: true
        };

        this.listeners = {
            afterrender: function() {
                me.store.reload();
            }
        }

        this.callParent(arguments);

    }
});