/**
 * Grid column for Invoice On Hold By
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.OnHoldBy', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.invoice.gridcol.onholdby',

	text     : 'On Hold By',
	dataIndex: 'invoice_onhold_by'
});