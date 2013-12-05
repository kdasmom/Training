/**
 * Grid column for Exception By
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.image.gridcol.ExceptionBy', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.image.gridcol.exceptionby',

	text     : 'Exception By',
	dataIndex: 'exception_by_userprofile_username',

	renderer: function(val, meta, rec) {
		if (val === null) {
			return '';
		}

		return val;
	}
});