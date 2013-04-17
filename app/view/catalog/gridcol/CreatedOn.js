/**
 * Grid column for Created On
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalog.gridcol.CreatedOn', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.catalog.gridcol.createdon',

	text     : 'Created On', 
	dataIndex: 'vc_createdt',
	renderer : function(val, meta, rec) {
		var ret = Ext.Date.format(val, Ext.Date.defaultFormat);
		
		if (rec.get('vc_createdby') !== null) {
			ret += ' by ' + rec.get('creator_userprofile_username');
		}
		
		return ret;
	}
});