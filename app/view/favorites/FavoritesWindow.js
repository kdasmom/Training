/**
 * Created by Renat Gatyatov
 */

Ext.define('NP.view.favorites.FavoritesWindow', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.favorites.favoriteswindow',

	requires: [
		'NP.lib.core.Translator',
		'NP.view.favorites.FavoriteGrid'
	],

    layout   : {
        type : 'vbox',
        align: 'stretch'
    },

    floating : true,
    width    : 380,

    cls      : 'favoritesWin',

	initComponent: function() {
		var that = this;

        this.defaults = { border: false, minHeight: 50, maxHeight: 250 };
		this.items = [
            {
                itemId       : 'favoritesGrid',
                title        : NP.Translator.translate('My Favorites'),
                xtype        : 'favorites.favoritegrid',
                showRemoveCol: true,
                viewConfig     : {
                    emptyText: NP.Translator.translate('No favorites'),
                    deferEmptyText: false
                },
                store        : {
                    fields: ['title', 'token'],
                    data  : NP.Config.getUserSettings()['user_favorites']
                }
            },
            {
                itemId         : 'recentRecordsGrid',
                title          : NP.Translator.translate('Recently Viewed Records'),
                xtype          : 'favorites.favoritegrid',
                showFavoriteCol: true,
                viewConfig     : {
                    emptyText: NP.Translator.translate('No recent records'),
                    deferEmptyText: false
                },
                store          : {
                    fields: ['title', 'token'],
                    data  : NP.Config.getUserSettings()['user_recent_records']
                }
            },
            {
                itemId         : 'recentReportsGrid',
                title          : NP.Translator.translate('Recently Viewed Reports'),
                xtype          : 'favorites.favoritegrid',
                showFavoriteCol: true,
                viewConfig     : {
                    emptyText: NP.Translator.translate('No recent reports'),
                    deferEmptyText: false
                },
                store          : {
                    fields: ['title', 'token'],
                    data  : []
                }
            }
        ];

		this.callParent(arguments);

		that.mon(Ext.getBody(), 'click', function(el, e){
			that.close(that.closeAction);
		}, that, { delegate: '.x-mask' });
	}
});