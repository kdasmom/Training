/**
 * Created by Andrey Baranov
 * date: 12/12/13 12:53 PM
 */


Ext.define('NP.view.shared.button.RemoveFromFavorites', {
	extend: 'Ext.button.Button',
	alias: 'widget.shared.button.removefromfavorites',

	requires: ['NP.lib.core.Translator'],

	text   : 'Remove from favorites',
	iconCls: 'delete-btn',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.callParent(arguments);
	}
});