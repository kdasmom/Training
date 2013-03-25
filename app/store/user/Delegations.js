/**
 * Store for Delegations. This store uses the Delegation model fields.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.user.Delegations', {
	extend: 'NP.lib.data.Store',
	
	requires: ['NP.model.user.Delegation'],

    constructor: function(cfg) {
        Ext.apply(this, cfg);

        this.fields = NP.model.user.Delegation.getFields();

        this.callParent(arguments);
    }
});