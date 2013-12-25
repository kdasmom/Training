Ext.define('NP.view.systemSetup.gridcol.AppliedTo', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.systemsetup.gridcol.appliedto',

    text     : 'Applied To',
    dataIndex: 'wfruletype_name',

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