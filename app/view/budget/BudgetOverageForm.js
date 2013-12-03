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
        'NP.lib.ui.ComboBox',
        'NP.model.gl.GlAccount'
    ],

    layout: 'vbox',

    bodyPadding: 8,
    autoScroll : true,

    title                          : 'New Budget Overage',
    propertyInputLabel             : 'Property',
    periodInputLabel               : 'Period',
    categoryInputLabel             : 'GL Code',
    approvalBudgetOverageInputLabel: 'Approval Budget Overage',
    reasonInputLabel               : 'Budget Overage Reason',

    initComponent: function() {
        var bar = [
            { xtype: 'shared.button.cancel' },
            { xtype: 'shared.button.delete', hidden: true },
            { xtype: 'shared.button.save'}
        ];
        this.tbar = bar;
        this.bbar = bar;

        this.defaults = {
            labelWidth: 175,
            width     : 600
        };

        var glStore = Ext.create('NP.store.gl.GlAccounts', {
            service : 'GLService',
            action  : 'getAll'
        });

        glStore.load();

        this.items = [
            {
                xtype           : 'customcombo',
                fieldLabel      : this.propertyInputLabel,
                name            : 'property_id',
                displayField    : 'property_name',
                valueField      : 'property_id',
                store           : 'user.Properties',
                allowBlank      : false
            },
            {
                xtype           : 'customcombo',
                fieldLabel      : this.periodInputLabel,
                name            : 'budgetoverage_period',
                store           : new Ext.data.Store({
                                    model: 'DateRange',
                                    fields: ['period_name','period_value']
                                }),
                displayField    : 'period_name',
                valueField      : 'period_value',
                queryMode       : 'local',
                autoSelect      : true,
                forceselection  : true,
                allowBlank      : false
            },
            {
                xtype           : 'customcombo',
                name            : 'glaccount_id',
                displayField    : 'display_name',
                valueField      : 'glaccount_id',
                store           : glStore,
                fieldLabel      : this.categoryInputLabel,
                allowBlank      : false
            },
            {
                xtype           : 'numberfield',
                name            : 'budgetoverage_amount',
                fieldLabel      : this.approvalBudgetOverageInputLabel,
                allowDecimals   : true,
                decimalPrecision: 2,
                step            : 1,
                allowBlank      : false,
                minValue        : 0
            },
            {
                xtype           : 'textarea',
                name            : 'budgetoverage_note',
                fieldLabel      : this.reasonInputLabel,
                allowBlank      : false
            }
        ];

        this.callParent(arguments);

        this.setPeriodRange();
    },

    setPeriodRange: function() {
        var currentDate = new Date();

        for (var i=1; i<12; i++) {
            this.findField('budgetoverage_period').getStore().add({
                period_name : Ext.Date.format(currentDate, 'm/Y'),
                period_value: Ext.Date.format(currentDate, 'm/d/Y')
            });
            currentDate = Ext.Date.add(currentDate, Ext.Date.MONTH, 1);
        }
    }
});