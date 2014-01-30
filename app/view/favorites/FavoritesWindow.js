/**
 * Created by Renat Gatyatov
 */

Ext.define('NP.view.favorites.FavoritesWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.favorites.favoriteswindow',

	requires: [
		'NP.lib.core.Translator',
		'NP.view.favorites.FavoriteGrid'
	],

	layout		: 'fit',

	modal		: true,
	draggable	: false,
	resizable	: false,
	closable	: false,
	width		: 380,
	y			: 32,

	initComponent: function() {
		var that = this;

		this.items = [{
			layout:'accordion',
			items: [
				{
					name : 'favorites',
					title: NP.Translator.translate('Favorites'),
					xtype: 'favorites.favoritegrid',
					store: {
						fields: ['title'],
						data  : NP.Config.getUserSettings()['user_favorites']
					}
				},
				{
					name: 'recentrecords',
					title: NP.Translator.translate('Recent Records'),
					xtype: 'favorites.favoritegrid',
					store: {
						showremovebutton: true,
						fields: ['title'],
						data  : NP.Config.getUserSettings()['user_recent_records']
					}
				},
				{
					name: 'recentreports',
					title: NP.Translator.translate('Recent Reports'),
					xtype: 'favorites.favoritegrid',
					store: []
				}
			]
		}];

		this.callParent(arguments);

		that.mon(Ext.getBody(), 'click', function(el, e){
			that.close(that.closeAction);
		}, that, { delegate: '.x-mask' });
	}
});