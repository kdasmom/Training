/**
 * Grid column for Created By
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.CreatedBy', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.createdby',

	text     : 'Created By',
	dataIndex: 'created_by'
});