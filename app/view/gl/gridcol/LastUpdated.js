/**
 * Grid column for Last Updated
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.gl.gridcol.LastUpdated', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.gl.gridcol.lastupdated',

	requires: ['NP.lib.core.Config'],

	text: 'Last Updated',
	dataIndex: 'glaccount_updatetm',
	renderer: function(val, meta, rec) {
		var returnVal = Ext.Date.format(val, NP.Config.getDefaultDateFormat() + ' h:iA');
		if (rec.get('last_updated_by') != null) {
			returnVal += ' (' + rec.get('last_updated_by_userprofile_username') + ')'
		}

		return returnVal;
	}
});