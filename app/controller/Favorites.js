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

	views: ['favorites.FavoritesWindow','NP.view.favorites.AddToFavoritesWindow'],

	init: function() {
		Ext.log('Favorites controller initialized');

		var me = this;

		me.control({
			'#favoritesBtn': {
				mouseover: me.favoritesView
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
			'#favoritesGrid, #recentRecordsGrid, #recentReportsGrid': {
				cellclick: function(gridView, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					if (cellIndex != 0) {
						me.application.addHistory(record.get('token'));
						me.getCmp('favorites.favoriteswindow').close();
					}
				}
			},
			'[xtype="favorites.favoritegrid"]': {
				addfavfromrecent   : me.addFavFromRecent,
				removefavfromrecent: me.removeFavFromRecent,
				removefavorite     : me.removeFavFromGrid
			}
		});
	},

	addToFavorites: function() {
		var mainPanel = Ext.ComponentQuery.query('#contentPanel')[0].items.getAt(0);
		var pageTitle = (mainPanel.title) ? mainPanel.title : '';

		Ext.create('NP.view.favorites.AddToFavoritesWindow', {pageTitle: pageTitle}).show();
	},

	removeFromFavoritesBtn: function() {
		var me    = this,
			token = this.getToken( Ext.History.getToken() );

		me.removeFavorite(token, function() {
			me.query('#addtofavoritesBtn', true).show();
			me.query('#removefromfavoritesBtn', true).hide();
		});
	},

	removeFavorite: function(token, callback) {
		var me        = this,
			favorites = NP.Config.getUserSettings()['user_favorites'];

		callback = callback || Ext.emptyFn;

		for (var i=0; i<favorites.length; i++) {
			if (favorites[i].token == token) {
				favorites.splice(i, 1);
				NP.Config.saveUserSetting('user_favorites', favorites, callback);
				return true;
			}
		}

		return false;
	},

	removeFavFromGrid: function(rec) {
		var me = this;

		me.removeFavorite(rec.get('token'), function() {
			me.query('#favoritesGrid', true).getStore().remove(rec);
			me.query('#recentRecordsGrid', true).getView().refresh();
			me.query('#recentReportsGrid', true).getView().refresh();
		});
	},

	removeFavFromRecent: function(rec, gridId) {
		var me = this;

		me.removeFavorite(rec.get('token'), function() {
			me.query('#' + gridId, true).getView().refresh();
			me.reloadFavoriteGrid();
		});
	},

	refreshFavoriteButtons: function(token) {
		var me        = this,
			favorites = NP.Config.getUserSettings()['user_favorites'],
			addBtn    = this.query('#addtofavoritesBtn', true),
			removeBtn = this.query('#removefromfavoritesBtn', true);
		
		if (favorites) {
			var token = this.getToken(token);

			if (this.issetTokenInFavoriteslist(token, favorites)) {
				addBtn.hide();
				removeBtn.show();
				return;
			}
		}

		addBtn.show();
		removeBtn.hide();
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

		me.saveFavorite(pageTitle, token, function() {
			me.getCmp('favorites.addtofavoriteswindow').close();

			me.query('#addtofavoritesBtn', true).hide();
			me.query('#removefromfavoritesBtn', true).show();

			NP.Util.showFadingWindow({
				html: NP.Translator.translate('New favorite has been added')
			});
		});
	},

	saveFavorite: function(title, token, callback) {
		var me        = this,
			favorites = NP.Config.getUserSettings()['user_favorites'];

		callback = callback || Ext.emptyFn;
		
		if (favorites) {
			if (me.issetTokenInFavoriteslist(token, favorites)) {
				me.getCmp('favorites.addtofavoriteswindow').close();

				NP.Util.showFadingWindow({ html: NP.Translator.translate('This page already exists in Favorites')});
				return;
			}
		}
		else {
			favorites = [];
		}

		// Add the new favorite
		favorites.unshift({ title: title, token: token });

		// Save the favorites
		NP.Config.saveUserSetting('user_favorites', favorites, callback);
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

	favoritesView: function(button) {
		// Check if the window already exists, only proceed if it doesn't
		if (this.getCmp('favorites.favoriteswindow') === null) {
			// Create the window and show it
			var win = Ext.create('NP.view.favorites.FavoritesWindow', {}).show();

			// Align the window right below the button
			win.alignTo(button, 'tr-br');

			// Function for monitoring when we are no longer over the button or window so
			// we can automatically close the window (we need it as a separate function
			// so we can remove the listener when done
			var bodyMouseOver = function(e, t) {
				var el = Ext.get(t);
				
				if (
					!el.hasCls('favoritesBtn')
					&& !el.hasCls('favoritesWin')
					&& !el.up('.favoritesBtn')
					&& !el.up('.favoritesWin')
				) {
					win.close();
				}
			};

			// Whenever the window closes, remove the mousemove listener
			win.on('close', function() {
				Ext.getBody().removeListener('mousemove', bodyMouseOver);
			});

			// Add the listener to the body element
			Ext.getBody().on('mousemove', bodyMouseOver);
		}
	},

	addFavFromRecent: function(rec, gridId) {
		var me = this;

		me.saveFavorite(rec.get('title'), rec.get('token'), function() {
			me.query('#' + gridId, true).getView().refresh();
			me.reloadFavoriteGrid();
		});
	},

	removeFavFromRecent: function(rec, gridId) {
		var me = this;

		me.removeFavorite(rec.get('token'), function() {
			me.query('#' + gridId, true).getView().refresh();
			me.reloadFavoriteGrid();
		});
	},

	reloadFavoriteGrid: function() {
		this.query('#favoritesGrid', true).getStore().loadData(NP.Config.getUserSettings()['user_favorites']);
	}
});