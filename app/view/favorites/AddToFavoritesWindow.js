/**
 * Created by Renat Gatyatov
 */

Ext.define('NP.view.favorites.AddToFavoritesWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.favorites.addtofavoriteswindow',

	requires: [
		'NP.view.shared.button.Close',
		'NP.view.shared.button.Save',
		'NP.lib.core.Translator'
	],

	layout          : 'fit',

	modal           : true,
	draggable       : false,
	resizable       : false,

	initComponent: function() {
		var that = this;

		that.title = NP.Translator.translate('Add to Favorites');

		this.items = [{
			xtype: 'container',
			margin: 8,
			items: [
				{
					xtype: 'textfield',
					fieldLabel: NP.Translator.translate('Page title') + ':',
					width: 400,
					value: this.pageTitle,
					name: 'pagetitle'
				},
				{
					xtype: 'shared.button.close',
					itemId: 'closeAddToFavoriteWindow'
				},
				{
					xtype: 'shared.button.save',
					itemId: 'saveToFavorites'
				}
			]
		}];

		this.callParent(arguments);
	}
});