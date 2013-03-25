/**
 * Grid column for Invoice Number of Days On Hold
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.InvoiceDaysOnHold', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.invoicedaysonhold',

	text     : 'Number of Days On Hold',
	dataIndex: 'invoice_days_onhold'
});