/**
 * Invoice Register page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.Register', {
	extend: 'Ext.tab.Panel',
    alias: 'widget.invoice.register',
    
    requires: [
    	'NP.view.shared.ContextPicker',
    	'NP.lib.core.Security',
    	'NP.lib.core.Translator',
    	'NP.view.invoice.InvoiceGrid',
    	'NP.store.invoice.Invoices',
    	'NP.view.shared.button.New'
    ],
    
    defaults: {
   		border: false
   	},

	initComponent: function() {
    	this.title = NP.Translator.translate('Invoice Register');

    	this.dockedItems = [{
			xtype: 'toolbar',
			dock: 'top',
			layout: 'hbox',
			items: [
				{ xtype: 'button', text: NP.Translator.translate('Get PO') },
		    	{ xtype: 'shared.button.new', itemId:'newInvoiceBtn', text: NP.Translator.translate('New Invoice') },
		    	{ xtype: 'button', text: NP.Translator.translate('Invoice Reports') },
		    	{ xtype: 'button', text: NP.Translator.translate('Search') },
		    	{ xtype: 'button', text: NP.Translator.translate('Receipt Register') },
		    	{ xtype: 'tbspacer', flex: 1 },
		    	{ xtype: 'shared.contextpicker', itemId: 'invoiceRegisterContextPicker' }
			]
		}];

		this.defaults = {
			autoScroll: true,
			border    : false
	    };

	    this.items = this.getGridConfigs();

	    this.callParent(arguments);
    },

    /* TODO: This will need to be updated when the invoice register is implemented, it's incomplete */
    getGridConfigs: function() {
    	var gridConfigs   = [],					// This will store the configs for the different grids
			baseCols      = ['vendor.gridcol.VendorName','shared.gridcol.Amount','property.gridcol.PropertyName','invoice.gridcol.Number'],
			openCols      = baseCols.slice(0),
			rejectedCols,
			overdueCols   = baseCols.slice(0),
			grids         = [],
			excludedCols  = ['shared.gridcol.RejectedDate','shared.gridcol.RejectedBy',
							'shared.gridcol.RejectedReason','shared.gridcol.LastApprovedDate',
							'shared.gridcol.LastApprovedBy','invoice.gridcol.HoldDate',
							'invoice.gridcol.DaysOnHold','invoice.gridcol.OnHoldBy',
							'invoice.gridcol.TemplateName','shared.gridcol.PendingApprovalDays',
							'shared.gridcol.PendingApprovalFor','invoice.gridcol.VoidDate',
							'invoice.gridcol.VoidBy','invoice.gridcol.PaymentDetails',
							'invoice.gridcol.PaymentAmountRemaining'],
			templateCols  = baseCols.slice(0),
			onHoldCols    = baseCols.slice(0),
			pendingCols,
			approvedCols  = baseCols.slice(0),
			submittedCols,
			transferredCols,
			paidCols      = baseCols.slice(0),
			voidCols      = baseCols.slice(0);

		// Setup columns for Open grid
		openCols.push('invoice.gridcol.Date','invoice.gridcol.CreatedDate','invoice.gridcol.DueDate');
		
		// Setup columns for Rejected grid
		rejectedCols = openCols.slice(0);
		rejectedCols.push('shared.gridcol.CreatedBy','shared.gridcol.RejectedDate','shared.gridcol.RejectedBy');
		
		// Setup columns for Overdue grid
		overdueCols.push('invoice.gridcol.Date','invoice.gridcol.DueDate','invoice.gridcol.Status');

		// Setup columns for Template grid
		templateCols.push('invoice.gridcol.TemplateName','invoice.gridcol.CreatedDate','invoice.gridcol.DueDate','shared.gridcol.CreatedBy');

		// Setup columns for On Hold grid
		onHoldCols.push('invoice.gridcol.DueDate','invoice.gridcol.HoldDate','invoice.gridcol.DaysOnHold','invoice.gridcol.OnHoldBy');

		// Setup columns for Pending grid
		pendingCols     = openCols.slice(0);
		pendingCols.push('shared.gridcol.PendingApprovalDays','shared.gridcol.PendingApprovalFor');

		// Setup columns for Approved grid
		approvedCols.push('invoice.gridcol.Date','invoice.gridcol.DueDate','invoice.gridcol.Period','shared.gridcol.PriorityFlag');

		// Setup columns for Submitted for Payment grid
		submittedCols = approvedCols.slice(0);

		// Setup columns for Transferred to GL grid
		transferredCols = approvedCols.slice(0);
		transferredCols.push('invoice.gridcol.Status');

		// Setup columns for Paid grid
		paidCols.push('invoice.gridcol.Date','invoice.gridcol.PaymentDetails','invoice.gridcol.PaymentAmountRemaining');

		// Setup columns for Void grid
		voidCols.push('invoice.gridcol.Date','invoice.gridcol.VoidDate','invoice.gridcol.VoidBy');

		grids.push(
			{
				title       : 'Open',
				cols        : openCols,
				excludedCols: excludedCols
			},{
				title: 'Rejected',
				cols : rejectedCols
			},{
				title: 'Overdue',
				cols : overdueCols,
				excludedCols: excludedCols
			},{
				title: 'Template',
				cols : templateCols,
				excludedCols: excludedCols
			},{
				tab  : 'OnHold',
				title: 'On Hold',
				cols : onHoldCols,
				excludedCols: excludedCols
			},{
				title: 'Pending',
				cols : pendingCols,
				excludedCols: excludedCols
			},{
				title: 'Approved',
				cols : approvedCols,
				excludedCols: ['shared.gridcol.RejectedDate','shared.gridcol.RejectedBy',
							'shared.gridcol.RejectedReason','invoice.gridcol.HoldDate',
							'invoice.gridcol.DaysOnHold','invoice.gridcol.OnHoldBy',
							'invoice.gridcol.TemplateName','shared.gridcol.PendingApprovalDays',
							'shared.gridcol.PendingApprovalFor','invoice.gridcol.VoidDate',
							'invoice.gridcol.VoidBy']
			},{
				tab  : 'Submitted',
				title: 'Submitted for Payment',
				cols : submittedCols,
				excludedCols: excludedCols
			},{
				tab  : 'Transferred',
				title: 'Transferred to GL',
				cols : transferredCols,
				excludedCols: excludedCols
			},{
				title: 'Paid',
				cols : paidCols,
				excludedCols: excludedCols
			},{
				title: 'Void',
				cols : voidCols,
				excludedCols: excludedCols
			}
		);

    	// Loop throw grid names to create the configs
    	Ext.each(grids, function(grid) {
    		var tab = grid.tab || grid.title;
    		// Add config to the main array
    		gridConfigs.push({
				xtype       : 'invoice.invoicegrid',
				itemId      : 'invoice_grid_' + tab.toLowerCase(),
				title       : NP.Translator.translate(grid.title),
				cols        : grid.cols,
				excludedCols: grid.excludedCols,
				stateful    : true,
				stateId     : 'invoice_register_' + tab,
				paging      : true,
				store       : Ext.create('NP.store.invoice.Invoices', {
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