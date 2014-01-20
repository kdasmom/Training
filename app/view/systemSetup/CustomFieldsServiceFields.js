/**
 * Created by Andrey Baranov
 * date: 1/20/14 2:32 PM
 */

Ext.define('NP.view.systemSetup.CustomFieldsServiceFields', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.customfieldsservicefields',

	requires: ['NP.lib.core.Translator'],

	padding: '10',
	border: false,

	initComponent: function() {
		var me  = this;

		this.title = NP.Translator.translate(this.title);

		this.callParent(arguments);
	}
});