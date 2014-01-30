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

	hideHeaders   : true,

	initComponent: function() {
		this.columns = [
			{
				text: 'title',
				dataIndex: 'title',
				flex: 1,
				renderer: function (val, metadata, record) {
					metadata.style = 'cursor: pointer;';
					return val;
				}
			}, {
				xtype: 'actioncolumn',
				width: 30,
				hidden: this.getStore().showremovebutton,
				items: [{
					icon: 'resources/images/buttons/delete.gif',
					tooltip: 'Delete',
					scope: this,
					handler: function(grid, rowIndex){
						var favorites = NP.Config.getUserSettings()['user_favorites'];
						favorites.splice(rowIndex, 1);
						NP.Config.saveUserSetting('user_favorites', favorites);

						this.getStore().removeAt(rowIndex);
					}
				}]
			}
		];

		if (!this.store) {
			this.store = [];
		}

		this.callParent(arguments);
	}
});