/**
 * Grid column for Invoice Payment Details
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.PaymentDetails', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.invoice.gridcol.paymentdetails',

	text     : 'Payment Details',
	dataIndex: 'payment_details'
});