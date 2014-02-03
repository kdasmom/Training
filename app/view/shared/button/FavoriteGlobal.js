/**
 * Favorite button that shows on every page and in header
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.button.FavoriteGlobal', {
	extend: 'Ext.button.Button',
	alias: 'widget.shared.button.favoriteglobal',

	requires: ['NP.lib.core.Translator'],

	text   : 'Favorites',
	iconCls: 'favorites-btn',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.callParent(arguments);
	}
});