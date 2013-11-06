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
        { name: 'budgetoverage_amount' },
        { name: 'budgetoverage_note' },
        { name: 'budgetoverage_created', type: 'date' }
    ],

    belongsTo: [
        {
            model         : 'NP.model.user.Userprofile',
            name          : 'userprofilename',
            getterName    : 'getUserProfile',
            foreignKey    : 'userprofile_id',
            primaryKey    : 'userprofile_id',
            reader        : 'jsonflat'
        },
        {
            model         : 'NP.model.user.Role',
            name          : 'rolename',
            getterName    : 'getRolename',
            foreignKey    : 'role_id',
            primaryKey    : 'role_id',
            reader        : 'jsonflat'
        },
        {
            model         : 'NP.model.property.Property',
            name          : 'propertyname',
            getterName    : 'getProperty',
            foreignKey    : 'property_id',
            primaryKey    : 'property_id',
            reader        : 'jsonflat'
        },
        {
            model         : 'NP.model.gl.GlAccount',
            name          : 'glaccountname',
            getterName    : 'getGlAccount',
            foreignKey    : 'glaccount_id',
            primaryKey    : 'glaccount_id',
            reader        : 'jsonflat'
        }
    ]
});