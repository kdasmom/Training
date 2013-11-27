/**
 * Created by Andrey Baranov
 * date: 11/26/13 4:45 PM
 */


Ext.define('NP.view.shared.button.Favorite', {
	extend: 'Ext.button.Button',
	alias: 'widget.shared.button.favorite',

	requires: ['NP.lib.core.Translator'],

	text   : 'Favorites',
	iconCls: 'favorite-btn',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.callParent(arguments);
	}
});