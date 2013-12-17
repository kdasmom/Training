Ext.define('NP.model.workflow.Rule', {
    extend: 'Ext.data.Model',

    idProperty: 'wfrule_id',

    fields: [
        { name: 'wfrule_id', type: 'int' },
        { name: 'wfrule_name' },

        { name: 'wfruletype_name' },

        { name: 'wfrule_status' },
        
        { name: 'userprofile_username' }
    ]
});