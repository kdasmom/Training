/**
 * Created by Andrey Baranov
 * date: 11/26/13 4:41 PM
 */

Ext.define('NP.view.shared.button.Shop', {
	extend: 'Ext.button.Button',
	alias: 'widget.shared.button.shop',

	requires: ['NP.lib.core.Translator'],

	text   : 'Shop',
	iconCls: 'shop-btn',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.callParent(arguments);
	}
});