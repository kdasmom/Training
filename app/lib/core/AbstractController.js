/**
 * Abstract controller class to be extended by all controllers. Provides some utility functions.
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.core.AbstractController', {
	extend: 'Ext.app.Controller',

	getCmp: function(comp) {
		return this.application.getComponent(comp);
	},

	setView: function(view, cfg, panel, forceCreate) {
		return this.application.setView(view, cfg, panel, forceCreate);
	},

	addHistory: function(newToken) {
		this.application.addHistory(newToken);
	}
});