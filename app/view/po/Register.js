/**
 * PO Register page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.Register', {
	extend: 'Ext.tab.Panel',
    alias: 'widget.po.register',
    
    requires: [
    	'NP.view.shared.ContextPicker',
    	'NP.lib.core.Security',
    	'NP.lib.core.Translator',
    	'NP.view.po.PoGrid',
    	'NP.store.po.Purchaseorders',
    	'NP.view.shared.button.New'
    ],
    
    defaults: {
   		border: false
   	},

	initComponent: function() {
    	this.title = NP.Translator.translate('Purchase Order Register');

    	this.dockedItems = [{
			xtype: 'toolbar',
			dock: 'top',
			layout: 'hbox',
			items: [
				{ xtype: 'shared.button.new', itemId:'newInvoiceBtn', text: NP.Translator.translate('New PO') },
		    	{ xtype: 'button', text: NP.Translator.translate('PO Reports') },
		    	{ xtype: 'button', text: NP.Translator.translate('Search') },
		    	{ xtype: 'button', text: NP.Translator.translate('Receipt Register') },
		    	{ xtype: 'tbspacer', flex: 1 },
		    	{ xtype: 'shared.contextpicker', itemId: 'poRegisterContextPicker' }
			]
		}];

		this.defaults = {
			autoScroll: true,
			border    : false
	    };

	    this.items = this.getGridConfigs();

	    this.callParent(arguments);
    },

    /* TODO: This will need to be updated when the po register is implemented, it's incomplete */
    getGridConfigs: function() {
    	var gridConfigs   = [],					// This will store the configs for the different grids
			baseCols      = ['vendor.gridcol.VendorName','shared.gridcol.Amount','property.gridcol.PropertyName','po.gridcol.Number'],
			openCols      = baseCols.slice(0),
			rejectedCols,
			overdueCols   = baseCols.slice(0),
			grids         = [],
			excludedCols  = ['shared.gridcol.LastApprovedDate','shared.gridcol.LastApprovedBy','shared.gridcol.RejectedBy',
							'shared.gridcol.RejectedDate','shared.gridcol.PendingApprovalDays','po.gridcol.SentToVendor',
							'po.gridcol.TemplateName'],
			
			templateCols  = ['vendor.gridcol.VendorName','shared.gridcol.Amount','property.gridcol.PropertyName',
							'po.gridcol.TemplateName','po.gridcol.CreatedDate','shared.gridcol.CreatedBy'],
			pendingCols,
			approvedCols  = baseCols.slice(0),
			submittedCols,
			transferredCols,
			paidCols      = baseCols.slice(0),
			voidCols      = baseCols.slice(0);

		// Setup columns for Open grid
		openCols.push('po.gridcol.CreatedDate','shared.gridcol.CreatedBy','shared.gridcol.PriorityFlag');
		
		// Setup columns for Rejected grid
		rejectedCols = openCols.slice(0);
		rejectedCols.push('shared.gridcol.RejectedDate','shared.gridcol.RejectedBy');

		// Setup columns for Pending grid
		pendingCols     = openCols.slice(0);
		pendingCols.push('shared.gridcol.PendingApprovalDays','shared.gridcol.PendingApprovalFor','shared.gridcol.PriorityFlag');

		// Setup columns for Approved grid
		approvedCols = openCols.slice(0);
		approvedCols.push('po.gridcol.SentToVendor','po.gridcol.ReceiptRequired','po.gridcol.ReceivedStatus');

		// Setup columns for Invoiced grid
		invoicedCols = openCols.slice(0);
		invoicedCols.push('po.gridcol.SentToVendor','po.gridcol.CompletedDate');

		// Setup columns for Cancelled grid
		cancelledCols = openCols.slice(0);
		cancelledCols.push('po.gridcol.CreatedDate','shared.gridcol.CreatedBy');

		grids.push(
			{
				title       : 'Open',
				cols        : openCols,
				excludedCols: excludedCols
			},{
				title       : 'Rejected',
				cols        : rejectedCols,
				excludedCols: excludedCols
			},{
				title       : 'Template',
				cols        : templateCols,
				excludedCols: excludedCols
			},{
				title       : 'Pending',
				cols        : pendingCols,
				excludedCols: excludedCols
			},{
				title       : 'Approved',
				cols        : approvedCols,
				excludedCols: excludedCols
			},{
				title       : 'Invoiced',
				cols        : invoicedCols,
				excludedCols: excludedCols
			},{
				title       : 'Cancelled',
				cols        : cancelledCols,
				excludedCols: excludedCols
			}
		);

    	// Loop through grid names to create the configs
    	Ext.each(grids, function(grid) {
    		var tab = grid.tab || grid.title;
    		// Add config to the main array
    		gridConfigs.push({
				xtype       : 'po.pogrid',
				itemId      : 'po_grid_' + tab.toLowerCase(),
				title       : NP.Translator.translate(grid.title),
				cols        : grid.cols,
				excludedCols: grid.excludedCols,
				stateful    : true,
				stateId     : 'po_register_' + tab,
				paging      : true,
				store       : Ext.create('NP.store.po.Purchaseorders', {
					service    : 'PoService',
					action     : 'getPoRegister',
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