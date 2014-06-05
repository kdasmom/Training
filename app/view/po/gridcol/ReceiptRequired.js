/**
 * Grid column for Receipt Required
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.gridcol.ReceiptRequired', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.po.gridcol.receiptrequired',

	requires: ['NP.lib.core.Config'],

	text     : 'Receipt Required',
	dataIndex: 'purchaseorder_rct_req',

	renderer: function(val) {
		if (Ext.isEmpty(val)) {
			val = NP.Config.getSetting('CP.RECEIVING_DEFAULT', '1');
		}

		if (val == 1) {
			return 'Yes';
		} else {
			return 'No';
		}
	}
});