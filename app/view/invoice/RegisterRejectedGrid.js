Ext.define('NP.view.invoice.RegisterRejectedGrid', {
    extend: 'NP.view.invoice.AbstractRegisterGrid',
    alias: 'widget.registerrejectedinvoice',
    store: 'InvoiceRegisterRejected',
    
    extraCols: [
        {
            text: 'Created Date',
            dataIndex: 'invoice_createddatetm',
            xtype: 'datecolumn'
        },{
            text: 'Due Date',
            dataIndex: 'invoice_duedate',
            xtype: 'datecolumn'
        },{
            text: 'Created By',
            dataIndex: 'created_by'
        },{
            text: 'Rejected Date',
            dataIndex: 'rejected_datetm',
            xtype: 'datecolumn'
        },{
            text: 'Rejected By',
            dataIndex: 'rejected_by'
        }
    ]
});