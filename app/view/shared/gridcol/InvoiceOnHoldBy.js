/**
 * Grid column for Invoice On Hold By
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.InvoiceOnHoldBy', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.invoiceonholdby',

	text     : 'On Hold By',
	dataIndex: 'invoice_onhold_by'
});