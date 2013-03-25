/**
 * Grid column for Invoice Created By
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.InvoiceCreatedBy', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.invoicecreatedby',

	text     : 'Created By',
	dataIndex: 'created_by'
});