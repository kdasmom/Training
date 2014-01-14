/**
 * Created by Andrey Baranov
 * date: 1/14/14 4:18 PM
 */

Ext.define('NP.view.systemSetup.SettingsImaging', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.settingsimaging',

	requires: ['NP.lib.core.Translator'],

	title: 'Imaging',

	html: 'Please remember to save your changes before proceeding to the next section. Any changes made without clicking "Save Settings" will be lost.',

	initComponent: function() {
		this.title = NP.Translator.translate(this.title);

		this.callParent(arguments);
	}
});
