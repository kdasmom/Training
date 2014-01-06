/**
 * Created by Andrey Baranov
 * date: 12/11/13 1:49 PM
 */

Ext.define('NP.view.shared.button.AddToOrder', {
	extend: 'Ext.button.Button',
	alias: 'widget.shared.button.addtoorder',

	requires: ['NP.lib.core.Translator'],

	text   : 'Add to order',
	iconCls: 'new-btn',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.callParent(arguments);
	}
});