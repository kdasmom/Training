Ext.define('NP.view.images.grid.columnView', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.images.grid.columnview',

//	dataIndex: 'Image_Index_Amount',
//	align    : 'right',

        flex: 0,
        width: 50,

        renderer: function(value, meta, record) {
            var method = [
                'window.open(',
                    '\'/ajax.php?service=ImageService&action=show&image_id=' + record.internalId + '\',',
                    '\'_blank\',',
                    '\'width=740, height=625, resizable=yes, scrollbars=yes\'',
                ');'
            ]
            return '<a href="javascript:' + method.join('') + '">View</a>';
        }
});