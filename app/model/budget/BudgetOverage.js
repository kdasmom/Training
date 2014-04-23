/**
 * Model for a Budget Overage (note that this model does not correspond to any database table)
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.budget.BudgetOverage', {
    extend: 'Ext.data.Model',

    requires: [
        'NP.lib.core.Config',
        'NP.model.user.Userprofile',
        'NP.model.user.Role',
        'NP.model.property.Property',
        'NP.model.gl.GlAccount'
    ],

    idProperty: 'budgetoverage_id',
    fields: [
        { name: 'budgetoverage_id', type: 'int' },
        { name: 'role_id', type: 'int' },
        { name: 'userprofile_id', type: 'int' },
        { name: 'property_id', type: 'int' },
        { name: 'glaccount_id', type: 'int' },
        { name: 'budgetoverage_period', type: 'date' },
        { name: 'budgetoverage_amount', type:'float' },
        { name: 'budgetoverage_note' },
        { name: 'budgetoverage_created', type: 'date' },

        // These fields are not DB columns from this model
        { name: 'property_name' },

        { name: 'glaccount_number' },
        { name: 'glaccount_name' },

        { name: 'category_name' },

        { name: 'budget_amount', type: 'float' },

        { name: 'person_id', type: 'int' },
        { name: 'person_firstname' },
        { name: 'person_lastname' }
    ]
});