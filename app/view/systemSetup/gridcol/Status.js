Ext.define('NP.view.systemSetup.gridcol.Status', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.systemsetup.gridcol.status',

    text     : 'Status',
    dataIndex: 'wfrule_status',

    /*renderer: function(val, meta, rec) {
        /*if (!val) {
            val = rec.raw['approval_type'];
	}

	if (val != 'New') {
            return 'Modification';
	}

	return val;*/
    //}
});