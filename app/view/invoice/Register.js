Ext.define('NP.view.invoice.Register', {
	extend: 'Ext.panel.Panel',
    alias: 'widget.invoice.register',
    
    requires: ['NP.view.shared.ContextPicker','NP.view.invoice.RegisterOpenGrid','NP.view.invoice.RegisterRejectedGrid'],
    
    title: 'Invoice Register',
    
    layout: {
        type: 'vbox',
        align: 'stretch'
   	},
    
   	border: false,
   	defaults: {
   		border: false
   	},

    items: [
    	{
    		dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				layout: 'hbox',
				items: [
					{ xtype: 'button', text: 'Get PO' },
			    	{ xtype: 'button', text: 'New Invoice' },
			    	{ xtype: 'button', text: 'Invoice Reports' },
			    	{ xtype: 'button', text: 'Search' },
			    	{ xtype: 'button', text: 'Receipt Register' },
			    	{ flex: 1 },
			    	{ xtype: 'shared.contextpicker', itemId: 'invoiceRegisterContextPicker' }
				]
			}]
    	},
    	{
    		xtype: 'tabpanel',
    		itemId: 'invoiceRegisterTabs',
    		
    		flex: 1,
    		
    		defaults :{
		        autoScroll: true,
		        border: false
		    },
		    
		    items: [
			    {
			    	itemId: 'openInvList',
			    	xtype: 'registeropeninvoice',
			    	title: 'Open'
			    },
			    {
			    	itemId: 'rejectedInvList',
			    	xtype: 'registerrejectedinvoice',
			    	title: 'Rejected'
			    },
			    {
			    	itemId: 'overdueInvList',
			    	title: 'Overdue',
			    	html: 'Test 3'
			    },
			    {
			    	itemId: 'templateInvList',
			    	title: 'Template',
			    	html: 'Test 4'
			    },
			    {
			    	itemId: 'onholdInvList',
			    	title: 'On Hold',
			    	html: 'Test 5'
			    },
			    {
			    	itemId: 'pendingInvList',
			    	title: 'Pending',
			    	html: 'Test 6'
			    },
			    {
			    	itemId: 'approvedInvList',
			    	title: 'Approved',
			    	html: 'Test 7'
			    },
			    {
			    	itemId: 'submittedInvList',
			    	title: 'Submitted for Payment',
			    	html: 'Test 8'
			    },
			    {
			    	itemId: 'transferredInvList',
			    	title: 'Transferred to GL',
			    	html: 'Test 9'
			    },
			    {
			    	itemId: 'paidInvList',
			    	title: 'Paid',
			    	html: 'Test 10'
			    },
			    {
			    	itemId: 'voidInvList',
			    	title: 'Void',
			    	html: 'Test 11'
			    }
    		]
    	}
    ]
});