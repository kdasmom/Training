Ext.define('NP.view.invoice.RegisterOpenGrid', {
    extend: 'NP.view.invoice.AbstractRegisterGrid',
    alias: 'widget.registeropeninvoice',
    
    createdDateColumnText: 'Created Date',
    dueDateColumnText    : 'Due Date',

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
            }
        ];

        this.callParent(arguments);
    }
});