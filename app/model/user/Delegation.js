/**
 * Model for a Delegation
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.user.Delegation', {
    extend: 'Ext.data.Model',
    
    requires: ['NP.lib.core.Config','NP.lib.core.Security'],

    idProperty: 'Delegation_Id',
    fields: [
        { name: 'Delegation_Id', type: 'int' },
        { name: 'UserProfile_Id', type: 'int' },
        { name: 'Delegation_To_UserProfile_Id', type: 'int' },
        { name: 'Delegation_StartDate', type: 'date', dateFormat: 'Y-m-d H:i:s' },
        { name: 'Delegation_StopDate', type: 'date', dateFormat: 'Y-m-d H:i:s' },
        { name: 'Delegation_Status', type: 'int', defaultValue: 1 },
        { name: 'Delegation_CreatedDate', type: 'date', dateFormat: 'Y-m-d H:i:s' },
        { name: 'delegation_createdby', type: 'int' }
    ],

    validations: [
        { field: 'UserProfile_Id', type: 'presence' },
        { field: 'Delegation_To_UserProfile_Id', type: 'presence' },
        { field: 'Delegation_StartDate', type: 'presence' },
        { field: 'Delegation_StopDate', type: 'presence' },
        { field: 'Delegation_Status', type: 'presence' }
    ]
});