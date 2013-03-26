/**
 * Special store for user properties. This store autoloads and pulls all properties that the currently
 * logged in user has access to. It uses the same fields as the Property model.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.user.Properties', {
	extend: 'NP.lib.data.Store',
	
	requires: ['NP.lib.core.Security','NP.model.property.Property'],
	
	service: 'PropertyService',
	action : 'getUserProperties',
	
    constructor: function(cfg) {
    	Ext.apply(this, cfg);

    	this.fields = NP.model.property.Property.getFields();
    	this.extraParams = {
			userprofile_id             : NP.lib.core.Security.getUser().get('userprofile_id'),
			delegated_to_userprofile_id: NP.lib.core.Security.getDelegatedToUser().get('userprofile_id')
		};

    	this.callParent(arguments);
    }
});