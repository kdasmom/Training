/**
 * Created by rnixx on 9/18/13.
 */


Ext.define('NP.view.budget.BudgetOverageForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias : 'widget.budget.budgetoverageform',

    requires: [
        'NP.lib.core.Config',
        'NP.view.shared.button.Save',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Delete',
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
    allCategoriesEmptyText: 'All Categories',
    emptyErrorText: 'cannot be empty',
    lessZeroErrorText: 'cannot be less the xero',

    initComponent: function() {
        var bar = [
            { xtype: 'shared.button.cancel' },
            { xtype: 'shared.button.delete', hidden: true },
            { xtype: 'shared.button.save'}
        ];
        this.tbar = bar;
        this.bbar = bar;

        this.defaults = {
            labelWidth: 125
        };

        var propertyStore = Ext.create('NP.store.property.Properties', {
            service: 'PropertyService',
            action : 'getByStatus',
            paging: true,
            extraParams: {property_status: 1, pageSize: null}
        });
        var glStore = Ext.create('NP.store.gl.GlAccounts', {
            service : 'GLService',
            action  : 'getAll'
        });

        propertyStore.load();
        glStore.load();

        this.items = [
            {
                xtype           : 'customcombo',
                fieldLabel      : this.propertyInputLabel,
                name            : 'property_id',
                displayField    : 'property_name',
                valueField      : 'property_id',
                store           : propertyStore,
                width           : 500,
                emptyText       : 'All ' + NP.Config.getPropertyLabel(true)
            },
            {
                xtype           : 'combobox',
                fieldLabel      : this.periodInputLabel,
                width           : 500,
                name            : 'budgetoverage_period',
                id              : 'budgetoverage_period',
                displayField    : 'period',
                valueField      : 'budgetoverage_period',
                queryMode       : 'local',
                autoSelect      : true,
                forceselection  : true
            },
            {
                xtype           : 'customcombo',
                emptyText       : this.allCategoriesEmptyText,
                width           : 500,
                name            : 'glaccount_id',
                displayField    : 'glaccount_name',
                valueField      : 'glaccount_id',
                store           : glStore,
                fieldLabel      : this.categoryInputLabel
            },
            {
                xtype           : 'numberfield',
                width           : 500,
                name            : 'budgetoverage_amount',
                fieldLabel      : this.approvalBudgetOverageInputLabel,
                allowDecimals   : true,
                decimalPrecision    : 2,
                step: 0.01
            },
            {
                xtype           : 'textarea',
                width           : 500,
                name            : 'budgetoverage_note',
                fieldLabel      : this.reasonInputLabel
            }
        ];

        this.callParent(arguments);
    },

    isValid: function() {
        var isValid = this.callParent(arguments);

        var propertyInput = this.findField('property_id');
        var periodInput = this.findField('budgetoverage_period');
        var categoryInput = this.findField('glaccount_id');
        var amountInput = this.findField('budgetoverage_amount');
        var noteInput = this.findField('budgetoverage_note');

        if (propertyInput.getValue() == null) {
            isValid = false;
            propertyInput.markInvalid(this.propertyInputLabel + ' ' + this.emptyErrorText);
        }
        if (periodInput.getValue() == null) {
            isValid = false;
            periodInput.markInvalid(this.periodInputLabel + ' ' + this.emptyErrorText);
        }
        if (categoryInput.getValue() == null) {
            isValid = false;
            categoryInput.markInvalid(this.categoryInputLabel + ' ' + this.emptyErrorText);
        }
        if (amountInput.getValue() == null) {
            isValid = false;
            amountInput.markInvalid(this.approvalBudgetOverageInputLabel + ' ' + this.emptyErrorText);
        }
        if (amountInput.getValue() < 0) {
            isValid = false;
            amountInput.markInvalid(this.approvalBudgetOverageInputLabel + ' ' + this.lessZeroErrorText);
        }
        if (noteInput.getValue() == null || noteInput.getValue() == '') {
            isValid = false;
            noteInput.markInvalid(this.reasonInputLabel + ' ' + this.emptyErrorText);
        }

        return isValid;
    }

});