/**
 * Grid column for Invoice Amount
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.InvoiceAmount', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.invoiceamount',

	requires: ['NP.lib.core.Util'],

	text     : 'Amount',
	dataIndex: 'invoice_amount',

	initComponent: function() {
		this.renderer = NP.lib.core.Util.currencyRenderer;
		this.callParent(arguments);
	}
});