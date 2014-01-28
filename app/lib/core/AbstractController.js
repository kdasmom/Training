/**
 * Abstract controller class to be extended by all controllers. Provides some utility functions.
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.core.AbstractController', {
	extend: 'Ext.app.Controller',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security',
		'NP.lib.core.Translator'
	],

	getCmp: function(comp) {
		return this.application.getComponent(comp);
	},

	setView: function(view, cfg, panel, forceCreate) {
		return this.application.setView(view, cfg, panel, forceCreate);
	},

	addHistory: function(newToken) {
		this.application.addHistory(newToken);
	},

	translate: function(text, values) {
		return NP.Translator.translate(text, values);
	},

	getSetting: function(name, defaultVal) {
		return NP.Config.getSetting(name, defaultVal);
	},

	hasPermission: function(moduleId) {
		return NP.Security.hasPermission(moduleId);
	}
});