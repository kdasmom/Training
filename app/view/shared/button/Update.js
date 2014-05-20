/**
 * Created by Andrey Baranov
 * date: 4/23/2014 11:11 AM
 */

Ext.define('NP.view.shared.button.Update', {
	extend: 'Ext.button.Button',
	alias: 'widget.shared.button.update',

	requires: ['NP.lib.core.Translator'],

	text: 'Update',
	iconCls: 'update-btn',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.callParent(arguments);
	}
});