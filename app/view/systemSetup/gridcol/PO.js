/**
 * Created by Andrey Baranov
 * date: 1/21/14 2:49 PM
 */

Ext.define('NP.view.systemSetup.gridcol.PO', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.systemsetup.gridcol.po',

	requires: ['NP.lib.core.Translator'],

	text     : 'PO',
	dataIndex: 'po_on_off',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.renderer = function(val, meta, record) {
			return parseInt(val) == 0 ? NP.Translator.translate('No') : NP.Translator.translate('Yes');
		};

		this.callParent(arguments);
	}
});