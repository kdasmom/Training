/**
 * Grid column for Invoice On Hold Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.InvoiceHoldDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.shared.gridcol.invoiceholddate',

	text     : 'On Hold Date',
	dataIndex: 'invoice_hold_datetm'
});