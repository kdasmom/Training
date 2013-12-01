Ext.define('NP.view.image.gridcol.RefNumber', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.image.gridcol.refnumber',

    text     : 'Reference Number',
    dataIndex: 'Image_Index_Ref',
    renderer : function(val, meta, rec) {
        if (rec.raw['invoice_id']) {
            return rec.getInvoice().get('invoice_ref');
        }
        return val;
    }
});