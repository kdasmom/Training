/**
 * Invoice Register page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.Register', {
	extend: 'Ext.panel.Panel',
    alias: 'widget.invoice.register',
    
    requires: [
    	'NP.view.shared.ContextPicker',
    	'NP.lib.core.Security',
    	'NP.view.invoice.InvoiceGrid',
    	'NP.store.invoice.Invoices'
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
			    
			    items: this.getGridConfigs()
	    	}
	    ];

	    this.callParent(arguments);
    },

    /* TODO: This will need to be updated when the invoice register is implemented, it's incomplete */
    getGridConfigs: function() {
    	var gridConfigs   = [],					// This will store the configs for the different grids
			baseCols      = ['vendor.gridcol.VendorName','shared.gridcol.Amount','property.gridcol.PropertyName','invoice.gridcol.Number'],
			openCols      = baseCols.slice(0),
			rejectedCols,
			overdueCols   = baseCols.slice(0),
			templateCols,
			onHoldCols,
			pendingCols,
			approvedCols,
			submittedCols,
			transferredCols,
			paidCols,
			voidCols,
			grids         = [];

		openCols.push('invoice.gridcol.Date','invoice.gridcol.CreatedDate','invoice.gridcol.DueDate');
		rejectedCols = openCols.slice(0);
		rejectedCols.push('shared.gridcol.CreatedBy','shared.gridcol.RejectedDate','shared.gridcol.RejectedBy')
		overdueCols.push('invoice.gridcol.Date','invoice.gridcol.DueDate');

		templateCols    = openCols.slice(0);
		onHoldCols      = openCols.slice(0);
		pendingCols     = openCols.slice(0);
		approvedCols    = openCols.slice(0);
		approvedCols.push('shared.gridcol.LastApprovedDate','shared.gridcol.LastApprovedBy');
		submittedCols   = openCols.slice(0);
		approvedCols.push('shared.gridcol.LastApprovedDate','shared.gridcol.LastApprovedBy');
		transferredCols = openCols.slice(0);
		approvedCols.push('shared.gridcol.LastApprovedDate','shared.gridcol.LastApprovedBy');
		paidCols        = openCols.slice(0);
		approvedCols.push('shared.gridcol.LastApprovedDate','shared.gridcol.LastApprovedBy');
		voidCols        = openCols.slice(0);

		grids.push(
			{
				title: 'Open',
				cols : openCols
			},{
				title: 'Rejected',
				cols : rejectedCols
			},{
				title: 'Overdue',
				cols : overdueCols
			},{
				title: 'Template',
				cols : templateCols
			},{
				tab  : 'OnHold',
				title: 'On Hold',
				cols : onHoldCols
			},{
				title: 'Pending',
				cols : pendingCols
			},{
				title: 'Approved',
				cols : approvedCols
			},{
				tab  : 'Submitted',
				title: 'Submitted for Payment',
				cols : submittedCols
			},{
				tab  : 'Transferred',
				title: 'Transferred to GL',
				cols : transferredCols
			},{
				title: 'Paid',
				cols : paidCols
			},{
				title: 'Void',
				cols : voidCols
			}
		);


    	// Loop throw grid names to create the configs
    	Ext.each(grids, function(grid) {
    		var tab = grid.tab || grid.title;
    		// Add config to the main array
    		gridConfigs.push({
				xtype   : 'invoice.invoicegrid',
				itemId  : 'invoice_grid_' + tab.toLowerCase(),
				title   : grid.title,
				cols    : grid.cols,
				stateful: true,
				stateId : 'invoice_register_' + tab,
				paging  : true,
				store   : Ext.create('NP.store.invoice.Invoices', {
					service    : 'InvoiceService',
					action     : 'getInvoiceRegister',
			        paging     : true,
					extraParams: {
						tab                        : tab, 
						userprofile_id             : NP.Security.getUser().get('userprofile_id'),
						delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id')
			       	}
			    })
    		});
    	});
		
		return gridConfigs;
    }
});