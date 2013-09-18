/**
 * Model for a Budget Overage (note that this model does not correspond to any database table)
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.budget.BudgetOverage', {
    extend: 'Ext.data.Model',

    requires: [
        'NP.lib.core.Config'
    ],

    idProperty: 'budgetoverage_id',
    fields: [
        { name: 'budgetoverage_id', type: 'int' },
        { name: 'role_id', type: 'int' },
        { name: 'userprofile_id', type: 'int' },
        { name: 'property_id', type: 'int' },
        { name: 'glaccount_id', type: 'int' },
        { name: 'budgetoverage_period', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
        { name: 'budgetoverage_amount' },
        { name: 'budgetoverage_note' },
        { name: 'budgetoverage_created', type: 'date', dateFormat: NP.Config.getServerDateFormat() }
    ],

    validations: [
        { field: 'budgetoverage_note', type: 'length', max: 4000 }
    ]
});