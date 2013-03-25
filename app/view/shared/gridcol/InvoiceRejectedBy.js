/**
 * Grid column for Invoice Rejected By
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.InvoiceRejectedBy', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.invoicerejectedby',

	text     : 'Rejected By',
	dataIndex: 'rejected_by'
});