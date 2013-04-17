/**
 * Grid column for Status
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalog.gridcol.Status', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.catalog.gridcol.status',

	text     : 'Status', 
	dataIndex: 'vc_status',
	renderer: function(val) {
        if (val == -2) return 'Processing';
        if (val == -1) return 'New';
        if (val == 0) return 'Inactive';
        if (val == 1) return 'Active';
    }
});