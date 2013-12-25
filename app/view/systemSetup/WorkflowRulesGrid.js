Ext.define('NP.view.systemSetup.WorkflowRulesGrid', {
    extend: 'NP.lib.ui.Grid',
    alias:  'widget.systemsetup.WorkflowRulesGrid',

    requires: [
        'NP.view.systemSetup.gridcol.Name',
        'NP.view.systemSetup.gridcol.AppliedTo',
        'NP.view.systemSetup.gridcol.LastUpdated',
        'NP.view.systemSetup.gridcol.Status',
        'NP.view.systemSetup.gridcol.Copy',
        'NP.view.systemSetup.gridcol.Delete',
        'NP.view.systemSetup.gridcol.View',
    ],

    initComponent: function(){
        var me = this;

        this.store = Ext.create('NP.store.workflow.Rules', {
            service : 'WFRuleService',
            action  : 'search',
            paging  : true
        });

        this.columns = [
            { xtype: 'systemsetup.gridcol.name' },
            { xtype: 'systemsetup.gridcol.appliedto' },
            { xtype: 'systemsetup.gridcol.lastupdated' },
            { xtype: 'systemsetup.gridcol.status' },
            { xtype: 'systemsetup.gridcol.copy' },
            { xtype: 'systemsetup.gridcol.delete' },
            { xtype: 'systemsetup.gridcol.view' }
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