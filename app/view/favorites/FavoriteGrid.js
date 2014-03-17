/**
 * @author Gatyatov Renat
 */

Ext.define('NP.view.favorites.FavoriteGrid', {
	extend: 'NP.lib.ui.Grid',
	alias: 'widget.favorites.favoritegrid',

	requires: [
		'NP.lib.core.Config',
		'NP.view.shared.button.Delete'
	],

	hideHeaders    : true,
	showRemoveCol  : false,
	showFavoriteCol: false,

	initComponent: function() {
		var me = this;

		var actionCols = [];
		if (me.showRemoveCol) {
			actionCols.push({
				hidden: !this.showRemove,
				iconCls: 'favorites-remove-btn',
				tooltip: 'Delete',
				scope: this,
				handler: function(gridView, rowIndex, colIndex, item, e, rec) {
					me.fireEvent('removefavorite', rec);
					
				}
			});
		}

		if (me.showFavoriteCol) {
			me.buildFavoriteHashMap();
			
			actionCols.push({
				getClass: function(val, meta, rec) {
					if (rec.get('token') in me.favorites) {
						return 'favorites-btn';
					} else {
						return 'favorites-empty-btn';
					}
				},
				getTip: function(val, meta, rec) {
					if (rec.get('token') in me.favorites) {
						return 'Remove From Favorites';
					} else {
						return 'Add To Favorites';
					}
				},
				scope: this,
				handler: function(gridView, rowIndex, colIndex, item, e, rec){
					if (rec.get('token') in me.favorites) {
						me.fireEvent('removefavfromrecent', rec, me.itemId);
					} else {
						me.fireEvent('addfavfromrecent', rec, me.itemId);
					}
				}
			});
		}

		this.columns = [
			{
				xtype: 'actioncolumn',
				width: 30,
				items: actionCols
			},{
				text: 'title',
				dataIndex: 'title',
				flex: 1,
				renderer: function (val, metadata, record) {
					metadata.style = 'cursor: pointer;';
					return val;
				}
			}
		];

		if (!this.store) {
			this.store = [];
		}

		this.callParent(arguments);

		if (me.showRemoveCol) {
			me.addEvents('removefavorite');
		}

		if (me.showFavoriteCol) {
			me.addEvents('addfavfromrecent', 'removefavfromrecent');
			me.getView().on('beforerefresh', me.buildFavoriteHashMap.bind(me))
		}
	},

	buildFavoriteHashMap: function() {
		var me = this;

		me.favorites = {};
		var favorites = NP.Config.getUserSettings()['user_favorites'];
		if (favorites) {
			for (var i=0; i<favorites.length; i++) {
				me.favorites[favorites[i].token] = true;
			}
		}
	}
});