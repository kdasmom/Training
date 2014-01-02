/**
 * Created by rnixx on 11/21/13.
 */


Ext.define('NP.view.vendor.gridcol.ViewVendor', {
	extend: 'NP.view.shared.gridcol.ButtonImg',
	alias: 'widget.vendor.gridcol.viewvendor',

	requires: ['NP.lib.core.Translator'],

	dataIndex: 'vendorfavorite_id',
	sortable : false,
	hideable : false,
	flex: 0.3,
	align: 'left',

	initComponent: function() {
		var that = this;
		this.renderer = function(val, meta, rec) {
			return '<img src="resources/images/buttons/view.gif" title="View" alt="view" class="view-vendor" /> View';
		};

		this.callParent(arguments);
	}
});