/**
 * Created by Andrey Baranov
 * date: 1/21/14 2:52 PM
 */


Ext.define('NP.view.systemSetup.gridcol.VendorEst', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.systemsetup.gridcol.vendorest',

	requires: ['NP.lib.core.Translator'],

	text     : 'VendorEst',
	dataIndex: 'vef_on_off',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.renderer = function(val, meta, record) {
			return parseInt(val) == 0 ? NP.Translator.translate('No') : (parseInt(val) == 1 ? NP.Translator.translate('Yes') : NP.Translator.translate('N/A'));
		};

		this.callParent(arguments);
	}
});