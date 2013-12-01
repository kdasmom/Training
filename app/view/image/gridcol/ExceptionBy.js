/**
 * Grid column for Exception By
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.image.gridcol.ExceptionBy', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.image.gridcol.exceptionby',

	text     : 'Marked as Exception By',
	dataIndex: 'exception_by_userprofile_username',

	renderer: function(val, meta, rec) {
		if (rec.raw['exception_by_userprofile_id']) {
			return rec.getExceptionUser().get('userprofile_username');
		}

		return '';
	}
});