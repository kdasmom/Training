/**
 * Model for a Delegation
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.user.Delegation', {
    extend: 'Ext.data.Model',
    
    requires: ['NP.lib.core.Config'],

    idProperty: 'Delegation_Id',
    fields: [
        { name: 'Delegation_Id', type: 'int' },
        { name: 'UserProfile_Id', type: 'int' },
        { name: 'Delegation_To_UserProfile_Id', type: 'int' },
        { name: 'Delegation_StartDate', type: 'date', dateReadFormat: NP.Config.getServerSmallDateFormat() },
        { name: 'Delegation_StopDate', type: 'date', dateReadFormat: NP.Config.getServerSmallDateFormat() },
        { name: 'Delegation_Status', type: 'int', defaultValue: 1 },
        { name: 'Delegation_CreatedDate', type: 'date', dateReadFormat: NP.Config.getServerSmallDateFormat() },
        { name: 'delegation_createdby', type: 'int' },

        // These fields are no DB columns in the DELEGATION table
        { name: 'delegation_status_name' },
        { name: 'userprofile_username' },
        { name: 'person_firstname' },
        { name: 'person_lastname' },
        { name: 'delegation_to_person_firstname' },
        { name: 'delegation_to_person_lastname' },
        { name: 'delegation_to_userprofile_username' },
        { name: 'delegation_createdby_userprofile_username' },
        { name: 'delegation_createdby_person_firstname' },
        { name: 'delegation_createdby_person_lastname' }
    ],

    validations: [
        { field: 'UserProfile_Id', type: 'presence' },
        { field: 'Delegation_To_UserProfile_Id', type: 'presence' },
        { field: 'Delegation_StartDate', type: 'presence' },
        { field: 'Delegation_StopDate', type: 'presence' },
        { field: 'Delegation_Status', type: 'presence' }
    ]
});