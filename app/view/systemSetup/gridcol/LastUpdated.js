Ext.define('NP.view.systemSetup.gridcol.LastUpdated', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.systemsetup.gridcol.lastupdated',

    text     : 'Last Updated',
    dataIndex: 'userprofile_username',

    //renderer: function(val, meta, rec) {
        /*if (!val) {
            val = rec.raw['approval_type'];
	}

	if (val != 'New') {
            return 'Modification';
	}

	return val;*/
    //}
});