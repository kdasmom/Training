Ext.define('NP.view.invoice.Register', function() {
	// Define the grids that need to be shown
	var grids = ['Open','Rejected','Overdue','Template','OnHold','Pending','Approved','Submitted','Transferred','Paid','Void'];

	return {
		extend: 'Ext.panel.Panel',
	    alias: 'widget.invoice.register',
	    
	    requires: [
	    	'NP.view.shared.ContextPicker',
	    	'NP.lib.core.Security',
	    	'NP.view.invoice.grid.RegisterOpen',
	    	'NP.view.invoice.grid.RegisterRejected',
	    	'NP.view.invoice.grid.RegisterOverdue',
	    	'NP.view.invoice.grid.RegisterTemplate',
	    	'NP.view.invoice.grid.RegisterOnHold',
	    	'NP.view.invoice.grid.RegisterPending',
	    	'NP.view.invoice.grid.RegisterApproved',
	    	'NP.view.invoice.grid.RegisterSubmitted',
	    	'NP.view.invoice.grid.RegisterTransferred',
	    	'NP.view.invoice.grid.RegisterPaid',
	    	'NP.view.invoice.grid.RegisterVoid'
	    ],
	    
	    layout: {
	        type: 'vbox',
	        align: 'stretch'
	   	},
	    
	   	defaults: {
	   		border: false
	   	},

		titleText             : 'Invoice Register',
		getPOBtnText          : 'Get PO',
		newInvoiceBtnText     : 'New Invoice',
		reportsBtnText        : 'Invoice Reports',
		searchBtnText         : 'Search',
		receiptRegisterBtnText: 'Receipt Register',
		
	    initComponent: function() {
	    	this.title = this.titleText;

	    	// This will store the configs for the different grids
	    	var gridConfigs = [];

	    	// Loop throw grid names to create the configs
	    	Ext.each(grids, function(item) {
	    		var item = item.toLowerCase();
	    		// Add config to the main array
	    		gridConfigs.push({
	    			xtype: 'invoice.grid.register'+item,
	    			stateful: true,
	    			stateId: 'invoice_register_' + item,
	    			paging: true,
	    			store: Ext.create('NP.store.invoice.Invoice', {
				        service: 'InvoiceService',
				        action : 'getInvoiceRegister',
				        extraParams: {
							tab                        : item, 
							userprofile_id             : NP.lib.core.Security.getUser().get('userprofile_id'),
							delegated_to_userprofile_id: NP.lib.core.Security.getDelegatedToUser().get('userprofile_id')
				       	},
				        paging : true
				    })
	    		});
	    	});

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
		    		
		    		flex: 1,
		    		
		    		defaults :{
				        autoScroll: true,
				        border: false
				    },
				    
				    items: gridConfigs
		    	}
		    ];

		    this.callParent(arguments);
	    }
	};
});