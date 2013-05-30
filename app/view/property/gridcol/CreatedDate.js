/**
 * Grid column for Created Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.gridcol.CreatedDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.property.gridcol.createddate',

	text: 'Created Date',
	dataIndex: 'createdatetm'
});