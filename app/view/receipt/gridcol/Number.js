/**
 * Grid column for Receipt Number
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.receipt.gridcol.Number', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.receipt.gridcol.number',

	text     : 'Receipt Number',
	dataIndex: 'receipt_ref'
});