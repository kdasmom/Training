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
			'#removefromfavoritesBtn': {
				click: me.removeFromFavoritesBtn
			},
			'#closeAddToFavoriteWindow': {
				click: function() {
					this.getCmp('favorites.addtofavoriteswindow').close();
				}
			},
			'#saveToFavorites': {
				click: me.saveToFavorites
			},
			'[xtype="favorites.favoriteswindow"] [name="favorites"], [xtype="favorites.favoriteswindow"] [name="recentrecords"], [xtype="favorites.favoriteswindow"] [name="recentreports"]': {
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

	removeFromFavoritesBtn: function() {
		var favorites = NP.Config.getUserSettings()['user_favorites'];
		var token = this.getToken( Ext.History.getToken() );

		for (var i=0; i<favorites.length; i++) {
			if (favorites[i].token == token) {
				favorites.splice(i, 1);
				break;
			}
		}

		Ext.getCmp('addtofavoritesBtn').show();
		Ext.getCmp('removefromfavoritesBtn').hide();
	},

	refreshFavoriteButtons: function(token) {
		var favorites = NP.Config.getUserSettings()['user_favorites'];
		var token = this.getToken( token );

		if (this.issetTokenInFavoriteslist(token, favorites)) {
			Ext.getCmp('addtofavoritesBtn').hide();
			Ext.getCmp('removefromfavoritesBtn').show();
		}
		else {
			Ext.getCmp('addtofavoritesBtn').show();
			Ext.getCmp('removefromfavoritesBtn').hide();
		}
	},

	issetTokenInFavoriteslist: function(token, favoritelist) {
		for (var key=0; key<favoritelist.length; key++) {
			if (favoritelist[key].token == token) {
				return true;
			}
		}

		return false;
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
		var token = this.getToken( Ext.History.getToken() );

		if (favorites) {
			if (this.issetTokenInFavoriteslist(token, favorites)) {
				me.getCmp('favorites.addtofavoriteswindow').close();

				NP.Util.showFadingWindow({ html: NP.Translator.translate('This page already exists in Favorites')});
				return;
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

			Ext.getCmp('addtofavoritesBtn').hide();
			Ext.getCmp('removefromfavoritesBtn').show();

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

		var token = this.getToken( Ext.History.getToken() );

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

	/**
	 * Get the token witchout user hash and token hash
 	 * @returns token
	 */
	getToken: function(token) {
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