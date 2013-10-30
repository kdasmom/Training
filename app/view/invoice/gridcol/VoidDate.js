/**
 * Grid column for Invoice Void Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.VoidDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.invoice.gridcol.voiddate',

	text     : 'Void Date',
	dataIndex: 'void_datetm'
});