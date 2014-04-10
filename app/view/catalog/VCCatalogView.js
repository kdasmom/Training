/**
 * Created by Andrey Baranov
 * date: 11/27/13 4:53 PM
 */


Ext.define('NP.view.catalog.VCCatalogView', {
	extend: 'NP.lib.ui.Grid',
	alias : 'widget.catalog.vccatalogview',

	requires: [
	],

	paging: true,

	initComponent: function() {

		this.store = [];

		this.callParent(arguments);
	}

});