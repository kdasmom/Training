/**
 * Grid column for Completed Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.gridcol.CompletedDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.po.gridcol.completeddate',

	text     : 'Date Created',
	dataIndex: 'completed_datetm'
});