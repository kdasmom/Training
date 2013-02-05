Ext.define('NP.view.invoice.Register', {
	extend: 'Ext.panel.Panel',
    alias: 'widget.invoice.register',
    
    requires: ['NP.view.shared.ContextPicker','NP.view.invoice.RegisterOpenGrid','NP.view.invoice.RegisterRejectedGrid'],
    
    layout: {
        type: 'vbox',
        align: 'stretch'
   	},
    
   	border: false,
   	defaults: {
   		border: false
   	},

	titleText             : 'Invoice Register',
	getPOBtnText          : 'Get PO',
	newInvoiceBtnText     : 'New Invoice',
	reportsBtnText        : 'Invoice Reports',
	searchBtnText         : 'Search',
	receiptRegisterBtnText: 'Receipt Register',
	openTabText           : 'Open',
	rejectedTabText       : 'Rejected',
	overdueTabText        : 'Overdue',
	templateTabText       : 'Template',
	holdTabText           : 'On Hold',
	templateTabText       : 'Template',
	pendingTabText        : 'Pending',
	approvedTabText       : 'Approved',
	submittedTabText      : 'Submitted for Payment',
	transferredTabText    : 'Transferred to GL',
	paidTabText           : 'Paid',
	voidTabText           : 'Void',

    initComponent: function() {
    	this.title = this.titleText;

    	this.items = [
	    	{
	    		dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					layout: 'hbox',
					items: [
						{ xtype: 'button', text: this.getPOBtnText }
				    	,{ xtype: 'button', text: this.newInvoiceBtnText }
				    	,{ xtype: 'button', text: this.reportsBtnText }
				    	,{ xtype: 'button', text: this.searchBtnText }
				    	,{ xtype: 'button', text: this.receiptRegisterBtnText }
				    	,{ xtype: 'tbspacer', flex: 1 }
				    	,{ xtype: 'shared.contextpicker', itemId: 'invoiceRegisterContextPicker' }
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
				    	title: this.openTabText
				    },
				    {
				    	itemId: 'rejectedInvList',
				    	xtype: 'registerrejectedinvoice',
				    	title: this.rejectedTabText
				    },
				    {
				    	itemId: 'overdueInvList',
				    	title: this.overdueTabText,
				    	html: 'Test 3'
				    },
				    {
				    	itemId: 'templateInvList',
				    	title: this.templateTabText,
				    	html: 'Test 4'
				    },
				    {
				    	itemId: 'onholdInvList',
				    	title: this.holdTabText,
				    	html: 'Test 5'
				    },
				    {
				    	itemId: 'pendingInvList',
				    	title: this.pendingTabText,
				    	html: 'Test 6'
				    },
				    {
				    	itemId: 'approvedInvList',
				    	title: this.approvedTabText,
				    	html: 'Test 7'
				    },
				    {
				    	itemId: 'submittedInvList',
				    	title: this.submittedTabText,
				    	html: 'Test 8'
				    },
				    {
				    	itemId: 'transferredInvList',
				    	title: this.transferredTabText,
				    	html: 'Test 9'
				    },
				    {
				    	itemId: 'paidInvList',
				    	title: this.paidTabText,
				    	html: 'Test 10'
				    },
				    {
				    	itemId: 'voidInvList',
				    	title: this.voidTabText,
				    	html: 'Test 11'
				    }
	    		]
	    	}
	    ];

	    this.callParent(arguments);
    }
});