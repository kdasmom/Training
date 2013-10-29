/**
 * Grid column for Invoice Payment Amount Remaining
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.PaymentAmountRemaining', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.invoice.gridcol.paymentamountremaining',

	requires: ['NP.lib.core.Util'],

	text     : 'Amount Remaining',
	dataIndex: 'payment_amount_remaining',
	align    : 'right',

	initComponent: function() {
		this.renderer = NP.lib.core.Util.currencyRenderer;
		
		this.callParent(arguments);
	}
});