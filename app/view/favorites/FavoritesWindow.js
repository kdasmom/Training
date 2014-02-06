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

	layout		: 'accordion',

	draggable	: false,
	resizable	: false,
	closable	: false,
	width		: 380,
	y			: 32,

    cls         : 'favoritesWin',

	initComponent: function() {
		var that = this;

		this.items = [
            {
                itemId       : 'favoritesGrid',
                title        : NP.Translator.translate('Favorites'),
                xtype        : 'favorites.favoritegrid',
                showRemoveCol: true,
                store        : {
                    fields: ['title', 'token'],
                    data  : NP.Config.getUserSettings()['user_favorites']
                }
            },
            {
                itemId         : 'recentRecordsGrid',
                title          : NP.Translator.translate('Recent Records'),
                xtype          : 'favorites.favoritegrid',
                showFavoriteCol: true,
                store          : {
                    fields: ['title', 'token'],
                    data  : NP.Config.getUserSettings()['user_recent_records']
                }
            },
            {
                itemId         : 'recentReportsGrid',
                title          : NP.Translator.translate('Recent Reports'),
                xtype          : 'favorites.favoritegrid',
                showFavoriteCol: true,
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