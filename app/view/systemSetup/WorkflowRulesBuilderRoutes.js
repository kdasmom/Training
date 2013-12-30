Ext.define('NP.view.systemSetup.WorkflowRulesBuilderRoutes', {
    //extend: 'NP.lib.ui.BoundForm',
    extend: 'Ext.panel.Panel',
    alias:  'widget.systemsetup.WorkflowRulesBuilderRoutes',

    initComponent: function() {
        this.items = [
            {
                html: 'RULE ROUTES COMPONENT'
            }
        ];
        this.callParent(arguments);
    }
});