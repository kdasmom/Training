Ext.define('NP.view.Viewport', {
    extend: 'Ext.container.Viewport',
    
    requires: [
    	'Ux.ui.HoverButton'
		,'NP.core.Config'
		,'NP.core.Security'
		,'NP.view.TopToolbar'
	],
	
	layout: 'border',
	
	initComponent: function() {
		this.items = {
	    	xtype: 'panel',
	    	region: 'center',
	    	dockedItems: {
			    xtype: 'toolbar',
			    dock: 'top',
			    items: []
			},
			layout: {
	            type: 'vbox',
	            align: 'stretch'
	       	},
	       	border: false,
	       	items: [
		       	{
			        xtype: 'panel',
			        height: 51,
			        border: 0,
			        html: '<img src="resources/images/payables-top.gif" />',
			        bodyStyle: {
			        	background: 'url(resources/images/headerspacer.gif) repeat-x'
			        }
			    },
			    {
			    	xtype: 'toptoolbar',
			    	itemId: 'viewportTopToolbar'
			    },
			    {
					xtype: 'panel',
					flex: 1,
			       	autoScroll: true,
			       	border: false,
			       	layout: 'fit',
			       	items: {
			       		itemId: 'contentPanel',
			       		layout: 'border',
			       		border: false,
			       		items: {
			       			region:'center',
			       			xtype: 'home'
			       		}
			       	}
				}
			]
	    };
	    
	    // TOP MENU ITEMS
	    var section, subSection;
	    
	    // Vendor Catalog
	    if ( NP.core.Config.getSetting('VC_isOn') == 1 && NP.core.Security.hasPermission(6067) ) {
			this.items.dockedItems.items.push({
				xtype: 'hoverButton',
				itemId: 'vcMenuBtn',
				text: 'Vendor Catalog',
				menu: {
					items: [
						{ text: 'Vendor Catalog Listings' },
						{ text: 'Open Orders' },
						{ text: 'Favorite items' }
					]
				}
			});
	    }
	    
	    // Purchase Orders
		if ( NP.core.Config.getSetting('PN.POOptions.POSwitch') == 1 && NP.core.Security.hasPermission(1026) ) {
			section = {
				xtype: 'hoverButton',
				text: 'Purchase Orders',
				menu: {
					items: [
						{
							text: 'PO Register',
							menu: {
								items: [
									{ text: 'Open' },
									{ text: 'Template' },
									{ text: 'Pending' },
									{ text: 'Approved' },
									{ text: 'Invoiced' },
									{ text: 'Rejected' },
									{ text: 'Cancelled' }
								]
							}
						}
					]
				}
			};
			
			if ( NP.core.Config.getSetting('CP.RECEIVING_ON') == 1 ) {
				subSection = { 
					text: 'Receipt Register',
					menu: {
						items: [
							{ text: 'Open' },
							{ text: 'Rejected' },
							{ text: 'Pending Approval' }
						]
					}
				};
				
				if ( NP.core.Config.getSetting('RECEIPT_postapproval') == 1 ) {
					subSection.menu.items.push({
						text: 'Pending Post Approval'
					});
				}
				
				subSection.menu.items.push({
					text: 'Approved'
				});
				
				section.menu.items.push(subSection);
			}
			
			if ( NP.core.Security.hasPermission(1027) ) {
				section.menu.items.push({ text: 'New P.O.' });
			}
			
			if ( NP.core.Security.hasPermission(1028) ) {
				section.menu.items.push({ text: 'Search P.O.' });
			}
			
			this.items.dockedItems.items.push(section);
		}
	    
	    // Invoice
	    if ( NP.core.Security.hasPermission(1031) ) {
	    	subSection = [
				{
					itemId: 'openInvRegisterMenuBtn',
					text: 'Open'
				}
			];
	    	
	    	if ( NP.core.Config.getSetting('PN.InvoiceOptions.OverDueOn') == 1 ) {
	    		subSection.push({
					itemId: 'overdueInvRegisterMenuBtn',
					text: 'Overdue'
				});
	    	}
	    	
	    	subSection.push({
				itemId: 'templateInvRegisterMenuBtn',
				text: 'Template'
			});
	    	
	    	if ( NP.core.Config.getSetting('PN.InvoiceOptions.HoldOn') == 1 ) {
	    		subSection.push({
					itemId: 'onholdInvRegisterMenuBtn',
					text: 'On Hold'
				});
	    	}
	    	
	    	subSection.push({
				itemId: 'pendingInvRegisterMenuBtn',
				text: 'Pending'
			},
			{
				itemId: 'approvedInvRegisterMenuBtn',
				text: 'Approved'
			},
			{
				itemId: 'submittedInvRegisterMenuBtn',
				text: 'Submitted for Payment'
			},
			{
				itemId: 'transferredInvRegisterMenuBtn',
				text: 'Transferred to GL'
			},
			{
				itemId: 'paidInvRegisterMenuBtn',
				text: 'Paid'
			});
	    	
	    	if ( NP.core.Config.getSetting('PN.InvoiceOptions.VoidOn') == 1 ) {
	    		subSection.push({
					itemId: 'voidInvRegisterMenuBtn',
					text: 'Void'
				});
	    	}
	    	
	    	subSection.push({
				itemId: 'rejectedInvRegisterMenuBtn',
				text: 'Rejected'
			});
	    	
	    	section = {
				xtype: 'hoverButton',
				itemId: 'invMenuBtn',
				text: 'Invoices',
				menu: {
					items: [
						{
							itemId: 'invRegisterMenuBtn',
							text: 'Invoice Register',
							menu: {
								items: subSection
							}
						}
					]
				}
			};
	    	
	    	if ( NP.core.Security.hasPermission(1032) ) {
	    		section.menu.items.push({
					text: 'New Invoice'
				});
	    	}
	    	
	    	if ( NP.core.Security.hasPermission(1033) ) {
	    		section.menu.items.push({
					text: 'Search Invoices'
				});
	    	}
	    	
			this.items.dockedItems.items.push(section);
		}
		
		// Vendors
		if ( NP.core.Security.hasPermission(1022) ) {
			section = {
				xtype: 'hoverButton',
				itemId: 'vendorMenuBtn',
				text: 'Vendors',
				menu: {
					items: []
				}
			};
			
			if ( NP.core.Security.hasPermission(1023) ) {
	    		section.menu.items.push({
					text: 'New Vendor'
				});
	    	}
			
			if ( NP.core.Security.hasPermission(1024) ) {
	    		section.menu.items.push({
					text: 'Search Vendors'
				});
	    	}
	    	
	    	if ( NP.core.Config.getSetting('pn.vendoroptions.vendorportal') == 1 && NP.core.Security.hasPermission(2028 ) ) {
	    		section.menu.items.push({
					text: 'VendorConnect Users'
				});
	    	}
			
			this.items.dockedItems.items.push(section);
	    }
		
		// Image Management
		if ( NP.core.Security.hasPermission(2086) && NP.core.Security.hasPermission(2039) && 
				(NP.core.Config.getSetting('pn.main.WebDocumentz') == 1 || NP.core.Config.getSetting('pn.main.WebDocumentz') == 2) ) {
			section = {
				xtype: 'hoverButton',
				itemId: 'imageMenuBtn',
				text: 'Image Management',
				menu: {
					items: [
						{ text: 'Images To Be Indexed' }
					]
				}
			};
			
			if ( NP.core.Security.hasPermission(2081) ) {
				section.menu.items.push({
					text: 'Invoice Images'
				});
			}
			
			if ( NP.core.Config.getSetting('PN.POOptions.POSwitch') == 1 && NP.core.Security.hasPermission(2087) ) {
				section.menu.items.push({
					text: 'Purchase Order Images'
				});
			}
			
			section.menu.items.push({
				text: 'Search Images'
			});
			
			if ( NP.core.Security.hasPermission(6050) ) {
				section.menu.items.push({
					text: 'Exceptions'
				});
			}
			
			this.items.dockedItems.items.push(section);
	    }
		
		// Budgets
		if ( NP.core.Security.hasPermission(1036) ) {
			section = {
				xtype: 'hoverButton',
				itemId: 'budgetMenuBtn',
				text: 'Budgets',
				menu: {
					items: []
				}
			};
			
			if ( NP.core.Security.hasPermission(1037) ) {
				section.menu.items.push({
					text: 'At-a-Glance'
				});
			}
			
			if ( NP.core.Security.hasPermission(1038) ) {
				section.menu.items.push({
					text: 'Budget Search'
				});
			}
			
			this.items.dockedItems.items.push(section);
			
			
	    }
		
		// Reports
		if ( NP.core.Security.hasPermission(1070) ) {
			section = {
				xtype: 'hoverButton',
				itemId: 'reportMenuBtn',
				text: 'Reports',
				menu: {
					items: []
				}
			};
			
			if ( NP.core.Security.hasPermission(2098) ) {
				section.menu.items.push({
					text: 'Custom Reports',
					menu: {
						items: [
							{ text: 'Overview' },
							{ text: 'System Saved Reports' },
							{ text: 'My Saved Reports' }
						]
					}
				});
			}
			
			if ( NP.core.Config.getSetting('PN.POOptions.POSwitch') == 1 ) {
				if ( NP.core.Security.hasPermission(1029) ) {
					section.menu.items.push({
						text: 'PO Register Reports'
					});
				}
				
				if ( NP.core.Security.hasPermission(6040) && NP.core.Config.getSetting('CP.RECEIVING_ON') == 1 ) {
					section.menu.items.push({
						text: 'Receipt Reports'
					});
				}
			}
			
			if ( NP.core.Security.hasPermission(1034) ) {
				section.menu.items.push({
					text: 'Invoice Register Reports'
				});
			}
			
			if ( NP.core.Security.hasPermission(2048) ) {
				section.menu.items.push({
					text: 'Job Costing Reports'
				});
			}
			
			if ( NP.core.Security.hasPermission(1063) ) {
				section.menu.items.push({
					text: 'Utility Reports'
				});
			}
			
			if ( NP.core.Security.hasPermission(2009) ) {
				section.menu.items.push({
					text: 'Vendor History Reports'
				});
			}
			
			if ( NP.core.Security.hasPermission(1039) ) {
				section.menu.items.push({
					text: NP.core.Config.getSetting('pn.budget.BudgetForecastLabel') + 's'
				});
			}
			
			if ( NP.core.Security.hasPermission(1069) ) {
				section.menu.items.push({
					text: 'Admin Reports'
				});
			}
			
			this.items.dockedItems.items.push(section);
	    }
		
		// Administration
		if ( NP.core.Security.hasPermission(3) ) {
			section = {
				xtype: 'hoverButton',
				itemId: 'adminMenuBtn',
				text: 'Administration',
				menu: {
					items: [
						{ text: 'My Settings' }
					]
				}
			};
			
			if ( NP.core.Security.hasPermission(4) ) {
				section.menu.items.push({
					text: 'User Manager'
				});
			}
			
			if ( NP.core.Security.hasPermission(6091) ) {
				section.menu.items.push({
					text: 'Message Center'
				});
			}
			
			if ( NP.core.Security.hasPermission(6047) ) {
				section.menu.items.push({
					text: 'Integration'
				});
			}
			
			if ( NP.core.Security.hasPermission(12) ) {
				section.menu.items.push({
					text: NP.core.Config.getSetting('PN.main.PropertyLabel', 'Property') + ' Setup'
				});
			}
			
			if ( NP.core.Security.hasPermission(1066) ) {
				section.menu.items.push({
					text: 'System Setup'
				});
			}
			
			if ( NP.core.Security.hasPermission(6014) ) {
				section.menu.items.push({
					text: 'GL Account Setup'
				});
			}
			
			if ( NP.core.Security.hasPermission(6066) && NP.core.Config.getSetting('VC_isOn') == 1 ) {
				section.menu.items.push({
					text: 'Catalog Maintenance'
				});
			}
			
			if ( NP.core.Security.hasPermission(6015) ) {
				subsection = {
					text: 'Import/Export Utility',
					menu: {
						items: [{
							text: 'Overview'
						}]
					}
				};
				
				if ( NP.core.Security.hasPermission(6016) ) {
					subsection.menu.items.push({
						text: 'GL'
					});
				}
				
				if ( NP.core.Security.hasPermission(6017) ) {
					subsection.menu.items.push({
						text: NP.core.Config.getSetting('PN.main.PropertyLabel', 'Property')
					});
				}
				
				if ( NP.core.Security.hasPermission(6018) ) {
					subsection.menu.items.push({
						text: 'Vendor'
					});
				}
				
				if ( NP.core.Security.hasPermission(6019) ) {
					subsection.menu.items.push({
						text: 'Invoice'
					});
				}
				
				if ( NP.core.Security.hasPermission(6020) ) {
					subsection.menu.items.push({
						text: 'User'
					});
				}
				
				if ( NP.core.Security.hasPermission(6021) ) {
					subsection.menu.items.push({
						text: 'Custom Field'
					});
				}
				
				subsection.menu.items.push({
					text: 'Splits'
				});
				
				section.menu.items.push(subsection);
			}
			
			if ( NP.core.Security.hasPermission(1043) ) {
				section.menu.items.push({
					text: 'Set Approval Budget Overage'
				});
			}
			
			if ( NP.core.Security.hasPermission(1057) ) {
				section.menu.items.push({
					text: 'Utility Setup'
				});
			}
			
			// Will need to add condition here to only show for admin users
			Ext.log('Need to modify to only show Mobile Setup to admin users');
			section.menu.items.push({
				text: 'Mobile Setup'
			});
			
			this.items.dockedItems.items.push(section);
	    }
	   
		this.callParent(arguments);
	}
});