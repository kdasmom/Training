/**
 * Image Mangement page
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.imageManagement.Management', {
	extend: 'Ext.panel.Panel',
    alias: 'widget.imagemanagement.management',
    
    requires: [
    	'NP.view.shared.ContextPicker',
    	'NP.lib.core.Security',
    	'NP.view.image.ImageGrid',
    	'NP.store.image.ImageIndexes'
    ],
    
    layout: {
        type: 'vbox',
        align: 'stretch'
   	},
    
   	defaults: {
   		border: false
   	},

	titleText             : 'Image Management',
	uploadBtnText         : 'Upload',
	nexusPayablesBtnText  : 'NexusPayables Invoice Separator Sheet',
	nexusServicesBtnText  : 'Nexus Services Invoice Separator Sheet',
	searchBtnText         : 'Search Images',
	reportBtnText         : 'Report',
	
    initComponent: function() {
    	this.title = this.titleText;

    	this.items = [
	    	{
	    		dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					layout: 'hbox',
					items: [
						{ xtype: 'button', text: this.uploadBtnText }
                                                ,{ xtype: 'button', text: this.nexusPayablesBtnText }
                                                ,{ xtype: 'button', text: this.nexusServicesBtnText }
                                                ,{ xtype: 'button', text: this.searchBtnText }
                                                ,{ xtype: 'button', text: this.reportBtnText }
                                                ,{ xtype: 'tbspacer', flex: 1 }
                                                ,{ xtype: 'shared.contextpicker', itemId: 'imageManagementContextPicker' }
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
			baseCols       = ['image.gridcol.ScanDate','property.gridcol.PropertyName','vendor.gridcol.VendorName'],
			indexedCols    = baseCols.slice(0),
			invoicesCols   = baseCols.slice(0),
			posCols        = baseCols.slice(0),
                        exceptionsCols = baseCols.slice(0),
                        deletedCols    = baseCols.slice(0),
			grids          = [];

		indexedCols.push('image.gridcol.Name','image.gridcol.DocType','image.gridcol.Source');
		invoicesCols.push('image.gridcol.Reference','image.gridcol.Amount','image.gridcol.InvoiceDate','shared.gridcol.PriorityFlag','image.gridcol.Source');
		posCols.push('image.gridcol.DocType','image.gridcol.Reference','image.gridcol.Amount','image.gridcol.Source');
                exceptionsCols.push('image.gridcol.DocType','image.gridcol.Reference','image.gridcol.Amount','image.gridcol.ExceptionBy','image.gridcol.DueDate');
                deletedCols.push('image.gridcol.Name','image.gridcol.NeededByDate','image.gridcol.DocType','image.gridcol.Reference','image.gridcol.Amount');

		grids.push(
			{
                                tab  : 'Indexed',
				title: 'Images To Be Indexed',
				cols : indexedCols
			},{
				title: 'Invoices',
				cols : invoicesCols
			},{
				title: 'POs',
				cols : posCols
			},{
				title: 'Exceptions',
				cols : exceptionsCols
			},{
                                tab  : 'Deleted',
				title: 'Deleted Images',
				cols : deletedCols
			}
		);


    	// Loop throw grid names to create the configs
    	Ext.each(grids, function(grid) {
    		var tab = grid.tab || grid.title;
    		// Add config to the main array
    		gridConfigs.push({
				xtype   : 'image.imagegrid',
				itemId  : 'image_grid_' + tab.toLowerCase(),
				title   : grid.title,
				cols    : grid.cols,
				stateful: true,
				stateId : 'image_management_' + tab,
				paging  : true,
				store   : Ext.create('NP.store.image.ImageIndexes', {
					service    : 'ImageService',
					action     : 'getImagesToIndex',
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