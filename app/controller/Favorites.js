/**
 * @author Renat Gatyatov
 * date: 1/23/14
 */

Ext.define('NP.controller.Favorites', {
	extend: 'NP.lib.core.AbstractController',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Translator'
	],

	init: function() {
		Ext.log('Favorites controller initialized');

		var me = this;

		me.control({
			'#favoritesBtn': {
				click: me.favoritesView
			},
			'#addtofavoritesBtn': {
				click: me.addToFavorites
			},
			'#closeAddToFavoriteWindow': {
				click: function() {
					this.getCmp('favorites.addtofavoriteswindow').close();
				}
			},
			'#saveToFavorites': {
				click: me.saveToFavorites
			},
			'[xtype="favorites.favoriteswindow"] [name="favorites"], [xtype="favorites.favoriteswindow"] [name="recentrecords"]': {
				cellclick: function(gridView, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					if (cellIndex == 0) {
						me.application.addHistory(record.raw.token);
						me.getCmp('favorites.favoriteswindow').close();
					}
				}
			}
		});
	},

	addToFavorites: function() {
		var mainPanel = Ext.ComponentQuery.query('#contentPanel')[0].items.getAt(0);
		var pageTitle = (mainPanel.title) ? mainPanel.title : '';

		Ext.create('NP.view.favorites.AddToFavoritesWindow', {pageTitle: pageTitle}).show();
	},

	saveToFavorites: function() {
		var me = this;

		var pageTitle = this.getCmp('favorites.addtofavoriteswindow').down('[name="pagetitle"]').value;

		if (pageTitle === '') {
			me.getCmp('favorites.addtofavoriteswindow').down('[name="pagetitle"]').markInvalid('This field is required');
			return;
		}

		// Get the current favorites
		var favorites = NP.Config.getUserSettings()['user_favorites'];
		var token = this.getCurrentToken();

		if (favorites) {
			for (var i=0; i<favorites.length; i++) {
				if (favorites[i].token == token) {
					me.getCmp('favorites.addtofavoriteswindow').close();

					NP.Util.showFadingWindow({ html: NP.Translator.translate('This page already exists in Favorites')});
					return;
				}
			}
		}
		else {
			favorites = [];
		}

		// Add the new favorite
		favorites.unshift({ title: pageTitle, token: token });

		// Save the favorites
		NP.Config.saveUserSetting('user_favorites', favorites, function() {
			me.getCmp('favorites.addtofavoriteswindow').close();

			NP.Util.showFadingWindow({
				html: NP.Translator.translate('New favorite has been added')
			});
		});
	},

	saveToRecentRecord: function(pageTitle) {
		var recentRecord = NP.Config.getUserSettings()['user_recent_records'];
		if (!recentRecord) {
			recentRecord = [];
		}

		var token = this.getCurrentToken();

		for (var i=0; i<recentRecord.length; i++) {
			if (recentRecord[i].token == token) {
				recentRecord.splice(i, 1);
			}
		}

		// Add the new record to recent records
		recentRecord.unshift({ title: pageTitle, token: token });

		if (recentRecord.length > 10) {
			recentRecord.pop();
		}

		// Save the recent records
		NP.Config.saveUserSetting('user_recent_records', recentRecord);
	},

	deleteFromFavorite: function(id) {
		var favorites = NP.Config.getUserSettings()['user_favorites'];

		favorites.splice(id, 1);

		NP.Config.saveUserSetting('user_favorites', favorites);
	},

	/**
	 * Get the token for the page we're currently on
	 * @returns token
	 */
	getCurrentToken: function() {
		var token = Ext.History.getToken();

		if (token) {
			tokenItems = token.split(':');
			tokenItems.splice(-2, 2);
			token = tokenItems.join(':');
		} else {
			token = 'Viewport:home:dashboard';
		}

		return token;
	},

	favoritesView: function() {
		var favoritesWindow = Ext.create('NP.view.favorites.FavoritesWindow', {}).show();

		favoritesWindow.alignTo(Ext.getBody(), 'tr-tr', [-200, 32]);
	}
});