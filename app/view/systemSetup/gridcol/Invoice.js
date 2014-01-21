/**
 * Created by Andrey Baranov
 * date: 1/21/14 2:43 PM
 */

Ext.define('NP.view.systemSetup.gridcol.Invoice', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.systemsetup.gridcol.invoice',

	requires: ['NP.lib.core.Translator'],

	text     : 'Invoice',
	dataIndex: 'inv_on_off',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.renderer = function(val, meta, record) {
			return parseInt(val) == 0 ? NP.Translator.translate('No') : NP.Translator.translate('Yes');
		};

		this.callParent(arguments);
	}
});