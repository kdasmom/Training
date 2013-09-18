/**
 * Created by rnixx on 9/18/13.
 */


Ext.define('NP.view.budget.BudgetOverageForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias : 'widget.budget.budgetoverageform',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.ui.DateTimeField',
        'NP.view.shared.button.Save',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Delete',
        'NP.view.shared.PropertyCombo',
        'NP.lib.ui.ComboBox'
    ],

    bodyPadding: 8,
    autoScroll : true,

    title: 'New Budget Overage',
    propertyInputLabel: 'Property',
    periodInputLabel: 'Period',
    categoryInputLabel: 'Category',
    approvalBudgetOverageInputLabel: 'Approval Budget Overage',
    reasonInputLabel: 'Budget Overage Reason',

    initComponent: function() {
        var bar = [
            { xtype: 'shared.button.cancel' },
            { xtype: 'shared.button.delete', hidden: true }
        ];
        this.tbar = bar;
        this.bbar = bar;

        this.defaults = {
            labelWidth: 125
        };

        this.items = [
            {
                xtype     : 'customcombo',
                name      : 'property_id',
                fieldLabel: this.propertyInputLabel,
                allowBlank: false,
                store     : 'property.Properties',
                width     : 500,
                valueField: 'property_id',
                displayField: 'property_name'
            }
        ];

        this.callParent(arguments);

        this.propertyCombo = this.query('[name="property_id"]')[0];
    }

});