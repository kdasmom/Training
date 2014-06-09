/**
 * Grid column for Last Updated
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.gridcol.LastUpdated', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.property.gridcol.lastupdated',

	requires: ['NP.lib.core.Config'],

	text: 'Last Updated',
	dataIndex: 'last_updated_datetm',
	renderer: function(val, meta, rec) {
		var returnVal = Ext.Date.format(val, NP.Config.getDefaultDateFormat() + ' h:iA');
		if (rec.get('last_updated_by') != null) {
			returnVal += ' (' + rec.get('last_updated_by_userprofile_username') + ')'
		}

		return returnVal;
	}
});