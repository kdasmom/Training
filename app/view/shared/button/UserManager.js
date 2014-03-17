/**
 * Created by Andrey Baranov
 * date: 1/14/14 5:31 PM
 */


Ext.define('NP.view.shared.button.UserManager', {
	extend: 'Ext.button.Button',
	alias: 'widget.shared.button.usermanager',

	requires: ['NP.lib.core.Translator'],

	text   : 'User Manager',
	iconCls: 'usermanager-btn',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.callParent(arguments);
	}
});