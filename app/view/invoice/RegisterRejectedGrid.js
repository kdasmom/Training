Ext.define('NP.view.invoice.RegisterRejectedGrid', {
    extend: 'NP.view.invoice.AbstractRegisterGrid',
    alias: 'widget.registerrejectedinvoice',
    
    createdDateColumnText : 'Created Date',
    dueDateColumnText     : 'Due Date',
    createdByColumnText   : 'Created By',
    rejectedDateColumnText: 'Rejected Date',
    rejectedByColumnText  : 'Rejected By',

    constructor: function() {
        this.extraCols = [
            {
                text: this.createdDateColumnText,
                dataIndex: 'invoice_createddatetm',
                xtype: 'datecolumn'
            },{
                text: this.dueDateColumnText,
                dataIndex: 'invoice_duedate',
                xtype: 'datecolumn'
            },{
                text: this.createdByColumnText,
                dataIndex: 'created_by'
            },{
                text: this.rejectedDateColumnText,
                dataIndex: 'rejected_datetm',
                xtype: 'datecolumn'
            },{
                text: this.rejectedByColumnText,
                dataIndex: 'rejected_by'
            }
        ];

        this.callParent(arguments);
    }
});