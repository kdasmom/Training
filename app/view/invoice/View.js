Ext.define('NP.view.invoice.View', {
    extend: 'Ext.form.Panel',
    alias: 'widget.invoiceView',
    
    requires: [
        'NP.view.invoice.Header',
        'NP.view.invoice.Custom',
        'NP.view.invoice.Lines',
        'NP.view.invoice.Notes',
        'NP.view.invoice.History',
        'NP.view.invoice.Forwards'
    ],
    
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [{
        xtype: 'panel',
        itemId: 'invoiceViewTitle',
        title: 'Invoice: [status here]',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        border: false,
        flex: 1,
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
	        	xtype: 'invoiceLineTable'
	        },
	        {
	        	xtype: 'invoiceCustom'
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
    }]
});