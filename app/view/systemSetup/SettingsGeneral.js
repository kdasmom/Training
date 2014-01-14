/**
 * Created by Andrey Baranov
 * date: 1/14/14 4:02 PM
 */


Ext.define('NP.view.systemSetup.SettingsGeneral', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.settingsgeneral',

	requires: ['NP.lib.core.Translator'],

	title: 'General',

	html: 'Please remember to save your changes before proceeding to the next section. Any changes made without clicking "Save Settings" will be lost.',

	initComponent: function() {
		this.title = NP.Translator.translate(this.title);

		this.callParent(arguments);
	}
});