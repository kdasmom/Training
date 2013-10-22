/**
 * The GLAccountSetup controller deals with operations in the Administration > GL Account Setup Setup section of the app
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.controller.GLAccountSetup', {
	extend: 'NP.lib.core.AbstractController',
	
	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security',
		'NP.lib.core.Net',
		'NP.lib.core.Util'
	],
	
        refs: [
		{ ref: 'glaccountGrid', selector: '[xtype="gl.glaccountsgrid"] customgrid' },
		{ ref: 'glaccountForm', selector: '[xtype="gl.glaccountsform"]' },
                { ref: 'glaccountEditBtn', selector: '[xtype="gl.glaccountsgrid"] [xtype="shared.button.edit"]' },
		{ ref: 'glaccountDistributeVendorsBtn', selector: '#distributeToAllVendorsBtn' },
		{ ref: 'glaccountDistributePropertiesBtn', selector: '#distributeToAllPropertiesBtn' },
                { ref: 'glaccountPrevBtn', selector : '#prevGlacoountBtn' },
                { ref: 'glaccountNextBtn', selector : '#nextGlacoountBtn' },
                { ref: 'glaccountPrevSaveBtn', selector : '#prevSaveGlacoountBtn' },
                { ref: 'glaccountNextSaveBtn', selector : '#nextSaveGlacoountBtn' },
                      
        ],
	
        // For localization
        changesSavedText          : 'Changes saved successfully',
        distributeDialogTitleText : 'Distribute To All ',
	distributeDialogText      : 'Are you sure you want to distribute this code to all ',
        errorDialogTitleText      : 'Error',
        noSelectedDialogTitle     : 'No selected',
        noSelectedDialogText      : 'No GL accounts have been selected',
        vendorsSuccessText        : 'Distribute To All Vendors Success',
	vendorsFailureText        : 'Distribute To All Vendors Failure',
	propertiesSuccessText     : 'Distribute To All Properties Success',
	propertiesFailureText     : 'Distribute To All Properties Failure',
	orderSuccessText          : 'Order Category Success',
	orderFailureText          : 'Order Category Failure',
	categorySuccessText       : 'Category saved Success',
	categoryFailureText       : 'Category saved Failure',
        glaccount_id_list         : [],
	init: function() {
		Ext.log('GLAccountSetup controller initialized');

		var app = this.application;

		// Setup event handlers
		this.control({
			// The main GL Account Setup panel
			'[xtype="gl.main"]': {
				// Run this whenever the user clicks on a tab on the GL Account Setup page
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('GLAccountSetup onTabChange() running');
					
					var activeTab = Ext.getClassName(newCard).split('.').pop();
					this.addHistory('GLAccountSetup:showGLAccountSetup:' + activeTab);
				}
			},
                        // The GLAccounts grid
			'[xtype="gl.glaccountsgrid"] customgrid': {
				selectionchange: this.gridSelectionChange,
				itemclick      : this.viewGLAccount
			},
                        // Edit GLAccounts
                        '#editGLAccountsBtn' : {
                                click : function() {
					this.selectedGLAccounts('edit');
				}
                        },
                        // Distribute To All Vendors
                        '#distributeToAllVendorsBtn' : {
                                click : function() {
                                    this.selectedGLAccounts('vendors')
                                }
                        },
                        // Distribute To All Properties
                        '#distributeToAllPropertiesBtn' : {
                                click : function() {
                                    this.selectedGLAccounts('properties')
                                }
                        },
                        // The Create New GL Account
			'[xtype="gl.glaccountsgrid"] [xtype="shared.button.cancel"]': {
				click: function() {
					this.addHistory('GLAccountSetup:showGLAccountSetup:Overview');
				}
			},
                        // The Create New GL Account
			'[xtype="gl.glaccountsgrid"] [xtype="shared.button.new"]': {
				click: function() {
					this.addHistory('GLAccountSetup:showGLAccountSetup:GLAccounts:Form');
				}
			},
                        // The cancel button on the glaccount form
			'#glaccountCancelBtn': {
				click: function() {
					this.activeGLAccountRecord = null;
					this.addHistory('GLAccountSetup:showGLAccountSetup:GLAccounts:Grid');
				}
			},
			// The save button on the glaccount form
			'#glaccountSaveBtn': {
				click: function () {
                                    this.saveGlAccount();
                                }
			},
			// The save button on the glaccount form
			'#glaccountSaveAndCreateNewBtn': {
				click: function () {
                                    this.saveGlAccount();
                                    this.addHistory('GLAccountSetup:showGLAccountSetup:GLAccounts:Form');
                                    var form = this.getCmp('gl.glaccountsform'); 
                                    form.getForm().reset();
                                }
			},
                                
                        // The cancel button on the glcategory form
			'#glcategoryCancelBtn': {
				click: 	function() {
                                    this.addHistory('GLAccountSetup:showGLAccountSetup:Overview');
                                }
			},
                        // The category grid
			'[xtype="gl.categorygrid"]': {
				selectionchange: this.selectCategory
			},
                        // The category grid
			'[xtype="gl.category"] [xtype="shared.button.new"]': {
				click: this.newCategory
			},
                        // The cancel button on the category form 
			'[xtype="gl.categoryform"] [xtype="shared.button.cancel"]': {
				click: this.cancelCategory
			},
			// The save button on the category form
			'[xtype="gl.categoryform"] [xtype="shared.button.save"]': {
				click: this.saveCategory
			},
                        // The save button on the glcategory form
			'#glcategoryOrderSaveBtn': {
				click: this.saveOrderCategory
			},
                        // Prev glaccount 
                        '#prevGlacoountBtn': {
                                click: function() {
                                    var token = Ext.History.getToken();
                                    var glaccount_id = token.split(':')[4];
                                    var curr = this.glaccount_id_list.indexOf(parseInt(glaccount_id));
                                    this.updateGlAccount(this.glaccount_id_list[curr-1]);
                                }
                        },
                        // Next glacount
                        '#nextGlacoountBtn': {
                                click: function() {
                                    var token = Ext.History.getToken();
                                    var glaccount_id = token.split(':')[4];
                                    var curr = this.glaccount_id_list.indexOf(parseInt(glaccount_id));
                                    this.updateGlAccount(this.glaccount_id_list[curr+1]);
                                }
                        },
                        // Prev glaccount 
                        '#prevSaveGlacoountBtn': {
                                click: function() {
                                    this.saveGlAccount();
                                    var token = Ext.History.getToken();
                                    var glaccount_id = token.split(':')[4];
                                    var curr = this.glaccount_id_list.indexOf(parseInt(glaccount_id));
                                    this.updateGlAccount(this.glaccount_id_list[curr-1]);
                                }
                        },
                        // Next glacount
                        '#nextSaveGlacoountBtn': {
                                click: function() {
                                    this.saveGlAccount();
                                    var token = Ext.History.getToken();
                                    var glaccount_id = token.split(':')[4];
                                    var curr = this.glaccount_id_list.indexOf(parseInt(glaccount_id));
                                    this.updateGlAccount(this.glaccount_id_list[curr+1]);
                                }
                        }
		});
	},
	
	/**
	 * Shows the main GL Account Setup page
	 * @param {String} [activeTab="Overview"] The tab currently active
	 * @param {String} [subSection]           The seubsection of the tab to open
	 * @param {String} [id]                   Id for an item being viewed
	 */
	showGLAccountSetup: function(activeTab, subSection, id) {
		var that = this;

		// Set the GL Account view
		var tabPanel = that.setView('NP.view.gl.Main');

		// If no active tab is passed, default to Open
		if (!activeTab) activeTab = 'Overview';
		
		// Check if the tab to be selected is already active, if it isn't make it the active tab
		var tab = that.getCmp('gl.' + activeTab.toLowerCase());
		
		// Set the active tab if it hasn't been set yet
		if (tab.getXType() != tabPanel.getActiveTab().getXType()) {
			tabPanel.suspendEvents(false);
			tabPanel.setActiveTab(tab);
			tabPanel.resumeEvents();
		}

		// Check if there's a show method for this tab
		var showMethod = 'show' + activeTab;
		if (that[showMethod]) {
			// If the show method exists, run it
			that[showMethod](subSection, id);
		}
	},
        showGLAccounts: function(subSection, glaccount_id) {
		if (!subSection) subSection = 'Grid';

		this['showGLAccounts' + subSection](glaccount_id);
	},

	showGLAccountsGrid: function() {
		this.setView('NP.view.gl.GLAccountsGrid', {}, '[xtype="gl.glaccounts"]');
                var grid = this.getCmp('gl.glaccounts').query('customgrid')[0];
                grid.reloadFirstPage();
	},
                
        gridSelectionChange: function(selectionModel, selected) {
		var fn = (selected.length) ? 'enable' : 'disable';
		this.getGlaccountEditBtn()[fn]();
		this.getGlaccountDistributeVendorsBtn()[fn]();
		this.getGlaccountDistributePropertiesBtn()[fn]();
	},
        
        selectedGLAccounts: function(action) {
            var that = this;
            var grid = this.getGlaccountGrid();
            var items = grid.getSelectionModel().getSelection();
            var glaccount_id_list = [];
            Ext.each(items, function(item) {
                   glaccount_id_list.push(item.get('glaccount_id'));
            });
            this.glaccount_id_list = glaccount_id_list;
            if (action === 'edit') {
                this.addHistory('GLAccountSetup:showGLAccountSetup:GLAccounts:Form:' + glaccount_id_list[0]);
            } else {
                Ext.MessageBox.confirm(this.distributeDialogTitleText + Ext.util.Format.capitalize(action), 
                this.distributeDialogText + action + '?', function(btn) {
                if (btn == 'yes') {
                    NP.lib.core.Net.remoteCall({
                        method  : 'POST',
                        mask    : grid,
                        requests: {
                                service               : 'GLService',
                                action                : 'distributeToAll' + Ext.util.Format.capitalize(action),
                                glaccount_id_list     : glaccount_id_list,
                                success: function(result, deferred) {
                                        // Unmark items in the grid
                                        grid.getStore().commitChanges();
                                        // Show a friendly message saying action was successful
                                        NP.Util.showFadingWindow({ html: that[action + 'SuccessText'] });
                                },
                                failure: function(response, options, deferred) {
                                        grid.getStore().rejectChanges();
                                        Ext.MessageBox.alert(that.errorDialogTitleText, that[action + 'FailureText']);
                                }
                        }
                    });
                }
            });
            }
	},
        
        viewGLAccount: function(grid, rec, item, index, e) {
		if (e.getTarget().className != 'x-grid-row-checker') {
			this.addHistory('GLAccountSetup:showGLAccountSetup:GLAccounts:Form:' + rec.get('glaccount_id'));
		}
	},
              
        updateGlAccount: function (glaccount_id) {           
            var that = this;
            
            this.addHistory('GLAccountSetup:showGLAccountSetup:GLAccounts:Form:' + glaccount_id);
        
            var bindCfg = {
			models   : ['gl.GlAccount']
            };

	    if (glaccount_id) {
	    	Ext.apply(bindCfg, {
				service    : 'GLService',
				action     : 'getGLAccount',
				extraParams: {
					id: glaccount_id
                                },
                                extraFields: ['vendors', 'properties', 'glaccount_category']
	    	});
	    }

	    var form = Ext.create('NP.view.gl.GLAccountsForm', {
			bind           : bindCfg,
			listeners      : {
				dataloaded: function(boundForm, data) {
				}
			}
		});

		this.setView(form, '','[xtype="gl.glaccounts"]');
		
        },
                
        showGLAccountsForm: function(glaccount_id) {
               
            var viewCfg = { bind: { models: ['gl.GlAccount'] }};
            if (glaccount_id) {
                if (arguments.length) {
                    Ext.apply(viewCfg.bind, {
                        service    : 'GLService',
                        action     : 'getGLAccount',
                        extraParams: {
                            id: glaccount_id
                        },
                        extraFields: ['vendors', 'properties', 'glaccount_category', 'glaccount_id_list']
                    });
                }
           }

            var form = this.setView('NP.view.gl.GLAccountsForm', viewCfg, '[xtype="gl.glaccounts"]'); 
            if (this.glaccount_id_list.length > 1) {
                form.findField('glaccount_id_list').setValue(this.glaccount_id_list);
                var  curr = this.glaccount_id_list.indexOf(parseInt(glaccount_id));
                var prevBtn = this.getGlaccountPrevBtn();
                var nextBtn = this.getGlaccountNextBtn();
                var prevSaveBtn = this.getGlaccountPrevSaveBtn();
                var nextSaveBtn = this.getGlaccountNextSaveBtn();
                if (curr > 0) {
                    prevBtn.show();
                    prevSaveBtn.show();
                } else {
                    prevBtn.hide();
                    prevSaveBtn.hide();
                }
                if (curr < this.glaccount_id_list.length-1 ) {
                    nextBtn.show();
                    nextSaveBtn.show();
                } else {
                    nextBtn.hide();
                    nextSaveBtn.hide();
                }
            } else {
                this.glaccount_id_list = form.findField('glaccount_id_list').getValue();
            }
        },

        /**
         * Save GLAccountSetup
         */
        saveGlAccount: function() {
            var that = this;

            var form = this.getCmp('gl.glaccountsform');

            if (form.isValid()) {
                form.submitWithBindings({
                    service: 'GLService',
                    action: 'saveGlAccount',
                    extraParams: {
                        glaccount_category: form.findField('glaccount_category').getValue(),
                    },
                    extraFields: {
                        vendors    : 'vendors',
                        properties : 'properties'
                    },
                    success: function(result, deferred) {
                       var glaccountModel = form.getModel('gl.GlAccount');
                        if (glaccountModel.get('glaccount_id') === null) {
                                that.addHistory('GLAccountSetup:showGLAccountSetup:GLAccounts:Form:' + result.id);
                                glaccountModel.set('glaccount_id', result.id);
                        } 
                        NP.Util.showFadingWindow({ html: that.changesSavedText });
                        
                    }
                });
            }
        },
        newCategory: function() {
		// Show the panel with the category details
		var form = this.getCmp('gl.categoryform'); 
                form.getForm().reset();
            	form.show();
		
	},
                
        selectCategory: function(selModel, recs) {
		// Show the panel with the category details
		var categoryPanel = selModel.view.up('customgrid').nextNode('[xtype="gl.categoryform"]');

		var form = categoryPanel.getForm();

		if (recs.length) {
			this.selectedCategory = recs[0];
			form.loadRecord(this.selectedCategory);
			categoryPanel.show();
		} else {
			this.selectedCategory = null;
			categoryPanel.hide();
		}
	},
                
        cancelCategory: function(button, e) {
		var form = button.up('[xtype="gl.categoryform"]');
		form.hide();
		form.getForm().reset();
		var grid = button.previousNode('[xtype="gl.categorygrid"]');
		grid.getSelectionModel().deselectAll();
		this.selectedCategory = null;
	},

	saveCategory: function(button, e) {
		var that = this;
                var form = button.up('[xtype="gl.categoryform"]');
		var grid = form.previousNode('[xtype="gl.categorygrid"]');
                if (form.getForm().isValid()) {
                    NP.lib.core.Net.remoteCall({
                        method  : 'POST',
                        requests: {
                                service               : 'GLService',
                                action                : 'saveGlCategory',
                                data                  : form.getValues(),
                                success: function(result, deferred) {
                                        // Unmark items in the grid
                                        grid.getStore().commitChanges();
                                        grid.getStore().reload();
                                        // Show a friendly message saying action was successful
                                        NP.Util.showFadingWindow({ html: that['categorySuccessText'] });
                                },
                                failure: function(response, options, deferred) {
                                        grid.getStore().rejectChanges();
                                        Ext.MessageBox.alert(that.errorDialogTitleText, that['categoryFailureText']);
                                }
                        }
                    });
                 }
	},
        
        /**
         * Save Order Category
         */
        saveOrderCategory: function() {
            var that = this;

            var grid = this.getCmp('gl.categorygrid');
            var items = grid.getStore().data.items;
            var glaccount_id_list = [];
            Ext.each(items, function(item) {
                    glaccount_id_list.push(item.get('glaccount_id'));
            });
            NP.lib.core.Net.remoteCall({
                        method  : 'POST',
                        mask    : grid,
                        requests: {
                                service               : 'GLService',
                                action                : 'saveOrderCategory',
                                glaccount_id_list     : glaccount_id_list,
                                success: function(result, deferred) {
                                        grid.getStore().commitChanges();
                                        // Show a friendly message saying action was successful
                                        NP.Util.showFadingWindow({ html: that['orderSuccessText'] });
                                },
                                failure: function(response, options, deferred) {
                                        grid.getStore().rejectChanges();
                                        Ext.MessageBox.alert(that.errorDialogTitleText, that['orderFailureText']);
                                }
                        }
                    });
  
        },
});