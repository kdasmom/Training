Ext.define('NP.view.systemSetup.WorkflowRulesView', {
    extend: 'Ext.panel.Panel',
    alias:  'widget.systemsetup.WorkflowRulesView',

    title:  'Workflow Management',
    layout: 'fit',

    initComponent: function() {
        var routes = [];
        for (var i = 0, l = this.data.routes.length; i < l; i++) {
            routes.push({
                xtype: 'displayfield',
                fieldLabel: this.data.routes[i].onames,
                value: this.data.routes[i].names
            });
        }

        this.items = [
            {
                xtype: 'fieldcontainer',
                layout: 'vbox',
                items: [
                    {
                        xtype: 'displayfield',
			fieldLabel: '',
			value: 'Workflow Rule - ' + this.data.rule[0].wfrule_name,
			layout: 'fit'

                    },
                    {
                        xtype: 'displayfield',
			fieldLabel: NP.Translator.translate('Rule Type'),
			value: this.data.rule[0].wfruletype_name,
			layout: 'fit'
                    },
                    {
                        xtype: 'fieldcontainer',
                        //layout: 'hbox',
                        items: routes
                    }
                ]
            }
        ]

        this.tbar = [
            {xtype: 'button', itemId: 'buttonClose', text: 'Close'},
            {xtype: 'button', itemId: 'buttonPrint', text: 'Print'},
        ]

        this.callParent(arguments);
    }
});