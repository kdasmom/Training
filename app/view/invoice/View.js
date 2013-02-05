Ext.define('NP.view.invoice.View', {
    extend: 'Ext.form.Panel',
    alias: 'widget.invoiceView',
    
    requires: [
        'NP.view.invoice.Header'
        ,'NP.view.invoice.Custom'
        ,'NP.view.invoice.Lines'
        ,'NP.view.invoice.Notes'
        ,'NP.view.invoice.History'
        ,'NP.view.invoice.Forwards'
    ],
    
    itemId: 'invoiceViewTitle',
    title: 'Invoice: [status here]',
    border: false,
    autoScroll: true,
    defaults: {
    	margin: '5',
    	border: false
    },
    items: [
        {
        	xtype: 'invoiceHeader'
        },
        {
        	xtype: 'invoiceCustom'
        },
        {
            xtype: 'invoicelinepanel'
        },
        {
        	xtype: 'invoiceNotes'
        },
        {
        	xtype: 'invoiceHistory'
        },
        {
        	xtype: 'invoiceForwards'
        }
	]
});