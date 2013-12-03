/**
 * Created by rnixx on 11/18/13.
 */


Ext.define('NP.view.shared.button.Reject', {
	extend: 'Ext.button.Button',
	alias: 'widget.shared.button.reject',

	requires: ['NP.lib.core.Translator'],

	text: 'Reject',
	iconCls: 'reject-btn',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.callParent(arguments);
	}
});