/**
 * Created by Andrey Baranov
 * date: 1/14/14 4:21 PM
 */


Ext.define('NP.view.systemSetup.SettingsInvoice', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.settingsinvoice',

	requires: ['NP.lib.core.Translator'],

	title: 'Invoice',

	html: 'Please remember to save your changes before proceeding to the next section. Any changes made without clicking "Save Settings" will be lost.',

	initComponent: function() {
		this.title = NP.Translator.translate(this.title);

		this.callParent(arguments);
	}
});