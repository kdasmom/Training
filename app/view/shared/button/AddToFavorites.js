/**
 * Created by Andrey Baranov
 * date: 12/11/13 1:49 PM
 */


Ext.define('NP.view.shared.button.AddToFavorites', {
	extend: 'Ext.button.Button',
	alias: 'widget.shared.button.addtofavorites',

	requires: ['NP.lib.core.Translator'],

	text   : 'Add to favorites',
	iconCls: 'add-to-favorite-btn',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.callParent(arguments);
	}
});