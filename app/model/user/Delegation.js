/**
 * Model for a Delegation
 *
 * @author 
 */
Ext.define('NP.model.user.Delegation', {
    extend: 'NP.lib.data.Model',
    
    requires: ['NP.lib.core.Config','NP.lib.core.Security'],

    idProperty: 'delegation_id',
    fields: [
        { name: 'delegation_id', type: 'int' },
        { name: 'userprofile_id', type: 'int' },
        { name: 'delegation_to_userprofile_id', type: 'int' },
        { name: 'delegation_startdate', type: 'date', dateFormat: NP.lib.core.Config.getServerSmallDateFormat() },
        { name: 'delegation_stopdate', type: 'date', dateFormat: NP.lib.core.Config.getServerSmallDateFormat() },
        { name: 'delegation_status', type: 'int', defaultValue: 1 },
        { name: 'delegation_createddate', type: 'date', dateFormat: NP.lib.core.Config.getServerSmallDateFormat() },
        { name: 'delegation_createdby', type: 'int', defaultValue: NP.Security.getUser().get('userprofile_id') }
    ],

    validations: [
        { field: 'userprofile_id', type: 'presence' },
        { field: 'delegation_to_userprofile_id', type: 'presence' },
        { field: 'delegation_startdate', type: 'presence' },
        { field: 'delegation_stopdate', type: 'presence' },
        { field: 'delegation_status', type: 'presence' }
    ]
});