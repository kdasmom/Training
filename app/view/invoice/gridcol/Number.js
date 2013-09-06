/**
 * Grid column for Invoice Number
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.Number', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.invoice.gridcol.number',

	text     : 'Invoice Number',
	dataIndex: 'invoice_ref'
});