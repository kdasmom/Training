/**
 * Special store for user regions. This store autoloads and pulls all regions that the currently
 * logged in user has access to. It uses the same fields as the Region model.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.user.Regions', {
	extend: 'NP.lib.data.Store',
	
	requires: ['NP.lib.core.Security','NP.model.property.Region'],
	
	service: 'PropertyService',
	action : 'getUserRegions',

    constructor: function(cfg) {
    	Ext.apply(this, cfg);

    	this.fields = NP.model.property.Region.getFields();
    	this.extraParams = {
			userprofile_id             : NP.lib.core.Security.getUser().get('userprofile_id'),
			delegated_to_userprofile_id: NP.lib.core.Security.getDelegatedToUser().get('userprofile_id')
		};

    	this.callParent(arguments);
    }
});