Ext.define('NP.view.invoice.RegisterOpenGrid', {
    extend: 'NP.view.invoice.AbstractRegisterGrid',
    alias: 'widget.registeropeninvoice',
    store: 'InvoiceRegisterOpen',
    
    extraCols: [
        {
            text: 'Created Date',
            dataIndex: 'invoice_createddatetm',
            xtype: 'datecolumn'
        },{
            text: 'Due Date',
            dataIndex: 'invoice_duedate',
            xtype: 'datecolumn'
        }
    ]
});