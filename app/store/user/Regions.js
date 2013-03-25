/**
 * Special store for user regions. This store autoloads and pulls all regions that the currently
 * logged in user has access to. It uses the same fields as the Region model.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.user.Regions', {
	extend: 'NP.lib.data.Store',
	
	requires: ['NP.model.property.Region'],
	
	autoLoad: true,

    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'UserService',
			action: 'getRegions'
		}
    },

    constructor: function(cfg) {
    	Ext.apply(this, cfg);

    	this.fields = NP.model.property.Region.getFields();

    	this.callParent(arguments);
    }
});