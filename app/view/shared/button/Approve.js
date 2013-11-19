/**
 * Created by rnixx on 11/18/13.
 */

Ext.define('NP.view.shared.button.Approve', {
	extend: 'Ext.button.Button',
	alias: 'widget.shared.button.approve',

	requires: ['NP.lib.core.Translator'],

	text: 'Approve',
	iconCls: 'approve-btn',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.callParent(arguments);
	}
});