Ext.define('NP.view.systemSetup.WorkflowRuleTypeCombo', {
    //extend: 'NP.lib.ui.ComboBox',
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.systemsetup.WorkflowRuleTypeCombo',

    queryMode: 'local',
    fieldLabel: 'Filter by:',

    valueField: 'id',
    displayField: 'type',

    initComponent: function() {
        this.store = Ext.create('Ext.data.Store', {
            data: [
                {id: 0, type: '--ALL--'},
                {id: 6, type: 'Rule Type'},
                {id: 1, type: '#request.propertylabel#'},
                {id: 2, type: 'GL Account'},
                {id: 3, type: 'User'},
                {id: 4, type: 'User Group'},
                {id: 5, type: 'Vendor'},
            ],
            fields: ['id', 'type']
        });

        this.callParent(arguments);
    }
});