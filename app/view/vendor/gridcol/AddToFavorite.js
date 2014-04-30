/**
 * Created by rnixx on 11/21/13.
 */

Ext.define('NP.view.vendor.gridcol.AddToFavorite', {
	extend: 'NP.view.shared.gridcol.ButtonImg',
	alias: 'widget.vendor.gridcol.addtofavorite',

	requires: ['NP.lib.core.Translator'],

	dataIndex: 'vendorfavorite_name',
	sortable : false,
	hideable : false,
	flex: 0.4,
	align: 'left',

	initComponent: function() {
		this.text = NP.Translator.translate('Favorite');

		var property_id = NP.Security.getCurrentContext().property_id;

		this.renderer = function(val, meta, rec) {
			if (rec.raw.vendorfavorite_id !== null && rec.raw.property_id == property_id) {
				return '<span class="pointer favorite-action favorite-remove"><img src="resources/images/buttons/delete.gif" title="Remove from favorite" alt="Remove from favorite" /> Remove from favorite</span>';
			} else {
				if (!rec.raw.vendorfavorite_id) {
					return '<span class="pointer favorite-action favorite-add"><img src="resources/images/buttons/new.gif" title="Add to favorite" alt="Add to favorite" /> Add to favorite</span>';
				} else {
					return ''
				}
			}
		};

		this.callParent(arguments);
	}
});
