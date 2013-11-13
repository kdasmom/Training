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

        var self = this;
    	this.items = [
	    	{
	    		xtype: 'tabpanel',
	    		
	    		flex: 1,
	    		
	    		defaults :{
			        autoScroll: true,
			        border: false
			    },
                        listeners: {
                            tabchange: function(tabPanel, newCard, oldCard, eOpts) {
                                self.applyButtons(newCard.itemId);
                            }
                        },
			    
			    items: this.getGridConfigs()
	    	}
	    ];
            this.tbar = [{ xtype: 'button', text: 'Index Selected', handler: function(){Ext.MessageBox.alert("Upload", "Upload")} },
                    { xtype: 'button', text: 'Delete Selected', handler: function(){Ext.MessageBox.alert("Nexus Payables", "Separator Sheet")} },

                    { xtype: 'button', text: this.uploadBtnText, handler: function(){Ext.MessageBox.alert("Upload", "Upload")} },
                    { xtype: 'button', text: this.nexusPayablesBtnText, handler: function(){Ext.MessageBox.alert("Nexus Payables", "Separator Sheet")} },
                    { xtype: 'button', text: this.nexusServicesBtnText, handler: function(){Ext.MessageBox.alert("Nexus Services", "Separator Sheet")} },

                    { xtype: 'button', text: this.searchBtnText, handler: function(){Ext.MessageBox.alert("Search", "Search")} },
                    { xtype: 'button', text: this.reportBtnText, handler: function(){Ext.MessageBox.alert("Report", "Report")} },

                    { xtype: 'tbspacer', flex: 1 },
                    { xtype: 'shared.contextpicker', itemId: 'imageManagementContextPicker' }
                ];

	    this.callParent(arguments);
    },

    getSelected: function () {
        var currenttab = this.items.get(this.items.keys[0]).getActiveTab();
        var currentgridsel = currenttab.getSelectionModel().getSelection();
        
        var res = [];
        for (var i = 0, l = currentgridsel.length; i<l; i++) {
            res.push(currentgridsel[0].getId());
        }
        res = res.join(" = ");
        alert(res);
    },

    applyButtons: function(tab) {
        var self = this;
        this.getDockedItems()[1].removeAll();
        switch (tab) {
            case "image_grid_indexed":
                this.getDockedItems()[1].add(
                    { xtype: 'button', text: 'Index Selected', handler: function(){
                            self.getSelected();
                            Ext.MessageBox.alert("Upload", "Upload")
                    }},
                    { xtype: 'button', text: 'Delete Selected', handler: function(){Ext.MessageBox.alert("Nexus Payables", "Separator Sheet")} },

                    { xtype: 'button', text: this.uploadBtnText, handler: function(){Ext.MessageBox.alert("Upload", "Upload")} },
                    { xtype: 'button', text: this.nexusPayablesBtnText, handler: function(){Ext.MessageBox.alert("Nexus Payables", "Separator Sheet")} },
                    { xtype: 'button', text: this.nexusServicesBtnText, handler: function(){Ext.MessageBox.alert("Nexus Services", "Separator Sheet")} },

                    { xtype: 'button', text: this.searchBtnText, handler: function(){Ext.MessageBox.alert("Search", "Search")} },
                    { xtype: 'button', text: this.reportBtnText, handler: function(){Ext.MessageBox.alert("Report", "Report")} },

                    { xtype: 'tbspacer', flex: 1 },
                    { xtype: 'shared.contextpicker', itemId: 'imageManagementContextPicker' }
                );
                break;
            case "image_grid_invoices":
                this.getDockedItems()[1].add(
                    { xtype: 'button', text: 'Convert Selected', handler: function(){Ext.MessageBox.alert("Convert Selected", "Convert Selected")} },
                    { xtype: 'button', text: 'Revert Selected', handler: function(){Ext.MessageBox.alert("Revert Selected", "Revert Selected")} },
                    { xtype: 'button', text: 'Delete Selected', handler: function(){Ext.MessageBox.alert("Delete Selected", "Delete Selected")} },

                    { xtype: 'button', text: this.searchBtnText, handler: function(){Ext.MessageBox.alert("Search", "Search")} },
                    { xtype: 'button', text: this.reportBtnText, handler: function(){Ext.MessageBox.alert("Report", "Report")} },

                    { xtype: 'tbspacer', flex: 1 },
                    { xtype: 'shared.contextpicker', itemId: 'imageManagementContextPicker' }
                );
                break;
            case "image_grid_pos":
                this.getDockedItems()[1].add(
                    { xtype: 'button', text: 'Revert Selected', handler: function(){Ext.MessageBox.alert("Revert Selected", "Revert Selected")} },
                    { xtype: 'button', text: 'Delete Selected', handler: function(){Ext.MessageBox.alert("Delete Selected", "Delete Selected")} },

                    { xtype: 'button', text: this.searchBtnText, handler: function(){Ext.MessageBox.alert("Search", "Search")} },
                    { xtype: 'button', text: this.reportBtnText, handler: function(){Ext.MessageBox.alert("Report", "Report")} },

                    { xtype: 'tbspacer', flex: 1 },
                    { xtype: 'shared.contextpicker', itemId: 'imageManagementContextPicker' }
                );
                break;
            case "image_grid_exceptions":
                this.getDockedItems()[1].add(
                    { xtype: 'button', text: 'Index Selected', handler: function(){Ext.MessageBox.alert("Index Selected", "Index Selected")} },
                    { xtype: 'button', text: 'Delete Selected', handler: function(){Ext.MessageBox.alert("Delete Selected", "Delete Selected")} },

                    { xtype: 'button', text: this.searchBtnText, handler: function(){Ext.MessageBox.alert("Search", "Search")} },
                    { xtype: 'button', text: this.reportBtnText, handler: function(){Ext.MessageBox.alert("Report", "Report")} },

                    { xtype: 'tbspacer', flex: 1 },
                    { xtype: 'shared.contextpicker', itemId: 'imageManagementContextPicker' }
                );
                break;
            case "image_grid_deleted":
                this.getDockedItems()[1].add(
                    { xtype: 'button', text: 'Revert Selected', handler: function(){Ext.MessageBox.alert("Revert Selected", "Revert Selected")} },
                    { xtype: 'button', text: 'Permanently Delete Selected', handler: function(){Ext.MessageBox.alert("Permanently Delete Selected", "Permanently Delete Selected")} },

                    { xtype: 'button', text: this.searchBtnText, handler: function(){Ext.MessageBox.alert("Search", "Search")} },

                    { xtype: 'tbspacer', flex: 1 },
                    { xtype: 'shared.contextpicker', itemId: 'imageManagementContextPicker' }
                );
                break;
        }
        //Ext.MessageBox.alert("test", "TAB CHANGED = " + tab);
        //Ext.MessageBox.alert("test", "TAB CHANGED = " + toolbar[0].dockedItems);
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
                if (grid.title === 'Exceptions') {
                    var method =  'getImageExceptions1';
                } else if (grid.title === 'Invoices') {
                    method = 'getImagesToConvert1';
                } else if (grid.title === 'POs') {
                    method = 'getImagesToProcess1';
                }
    		// Add config to the main array
    		gridConfigs.push({
				xtype   : 'image.imagegrid',
selType: 'checkboxmodel',
selModel: {
   mode: 'MULTI',   // or SINGLE, SIMPLE ... review API for Ext.selection.CheckboxModel
   checkOnly: true    // or false to allow checkbox selection on click anywhere in row
},                                
				itemId  : 'image_grid_' + tab.toLowerCase(),
				title   : grid.title,
				cols    : grid.cols,
				stateful: true,
				stateId : 'image_management_' + tab,
				paging  : true,
				store   : Ext.create('NP.store.image.ImageIndexes', {
					service    : 'ImageService',
					action     : method ? method : 'getImagesToIndex1',
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