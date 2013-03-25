/**
 * Special store for user properties. This store autoloads and pulls all properties that the currently
 * logged in user has access to. It uses the same fields as the Property model.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.user.Properties', {
	extend: 'NP.lib.data.Store',
	
	requires: ['NP.model.property.Property'],
	
	autoLoad: true,
	
	proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'UserService',
			action: 'getProperties'
		}
    },

    constructor: function(cfg) {
    	Ext.apply(this, cfg);

    	this.fields = NP.model.property.Property.getFields();

    	this.callParent(arguments);
    }
});