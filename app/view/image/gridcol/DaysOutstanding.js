/**
 * Grid column for Image Days Oustanding
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.image.gridcol.DaysOutstanding', {
	extend: 'Ext.grid.column.Number',
	alias: 'widget.image.gridcol.daysoutstanding',

	text     : 'Days Outstanding',
	dataIndex: 'days_outstanding',
	format   : '0,000',
	align    : 'right'
});