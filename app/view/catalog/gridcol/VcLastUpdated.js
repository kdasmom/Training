/**
 * Grid column for Last Updated
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalog.gridcol.VcLastUpdated', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.catalog.gridcol.vclastupdated',

	text     : 'Last Updated', 
	dataIndex: 'vc_lastupdatedt',
	renderer : function(val, meta, rec) {
		var ret = Ext.Date.format(val, Ext.Date.defaultFormat);
		
		if (rec.get('vc_lastupdateby') !== null) {
			ret += ' by ' + rec.get('updater_userprofile_username');
		}
		
		return ret;
	}
});