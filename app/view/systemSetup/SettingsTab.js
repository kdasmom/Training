/**
 * Created by Andrey Baranov
 * date: 1/16/14 3:37 PM
 */

Ext.define('NP.view.systemSetup.SettingsTab', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.settingstab',

	requires: ['NP.lib.core.Translator'],

	layout: {
		'type': 'vbox',
		'align': 'stretch'
	},

	defaults: {
		labelWidth: '80%'
	},

	border: false,
	autoScroll: true,

	initComponent: function() {
		var me  = this;

		this.title = NP.Translator.translate(this.title);

		me.items = [
			{
				xtype  : 'component',
				html   : '<div style="color: red;">Please remember to save your changes before proceeding to the next section. Any changes made without clicking "Save Settings" will be lost.</div>',
				padding: 8
			},
			{
				xtype      : 'form',
				name       : 'params',
				border     : false,
				bodyPadding: 8,
				items      : [],
				layout     : {
					type   : 'table',
					columns: 2
				},
				defaults: {
					padding: '5 0'
				}
			}
		];

		this.callParent(arguments);
	}
});