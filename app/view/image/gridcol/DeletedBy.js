/**
 * Grid column for Deleted By
 */
Ext.define('NP.view.image.gridcol.DeletedBy', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.image.gridcol.deletedby',

    text     : 'Deleted By',
    dataIndex: 'deleted_by_userprofile_username',
        
    renderer: function(val, meta, rec) {
        if (rec.raw['deleted_by_userprofile_id']) {
            return rec.getDeletedByUser().get('userprofile_username');
        }
        return '';
    }
});