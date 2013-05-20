/**
 * Store for Delegations. This store uses the Delegation model fields.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.user.Delegations', {
	extend: 'NP.lib.data.Store',
	
	requires: ['NP.model.user.Delegation'],

    constructor: function(cfg) {
        var that = this;

        Ext.apply(this, cfg);

        this.fields = [];
        Ext.Array.each(NP.model.user.Delegation.getFields(), function(field) {
            that.fields.push({
                name: field.name,
                type: field.type.type,
                dateFormat: field.dateFormat
            });
        });
        this.fields.push(
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
    	);

        this.callParent(arguments);
    }
});