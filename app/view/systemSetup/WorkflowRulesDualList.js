Ext.define('NP.view.systemSetup.WorkflowRulesDualList', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.systemsetup.WorkflowRulesDualList',

    layout: {
        type: 'hbox',
        pack: 'start'
    },
    defaults: {
        border: 0
    },

    initComponent: function() {
        this.items = [
            {
                xtype: 'panel',
                layout: {
                    type: 'hbox',
                    pack: 'start'
                },
                items: [
                    {
                        html: ''
                    },
                    {
                        xtype: 'panel'
                    }
                ]
            },
            {
                xtype: 'panel'
            },
            {
                xtype: 'panel',
                layout: {
                    type: 'hbox',
                    pack: 'start'
                },
                items: [
                    {
                        html: ''
                    },
                    {
                        xtype: 'panel'
                    }
                ]
            }
        ];
        this.callParent(arguments);
    }
});