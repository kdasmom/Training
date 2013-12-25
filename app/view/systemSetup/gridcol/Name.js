Ext.define('NP.view.systemSetup.gridcol.Name', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.systemsetup.gridcol.name',

    text     : 'Name',
    dataIndex: 'wfrule_name',
    flex: 7

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