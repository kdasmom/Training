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
	
	// For localization
	errorDialogTitleText      : 'Error',
        newGLAccountTitleText     : 'New GL Account',
	editPropertyTitleText     : 'Editing',
        saveSuccessText           : 'Your changes were saved.',

	init: function() {
		Ext.log('GLAccountSetup controller initialized');

		var app = this.application;

		// Setup event handlers
		this.control({
			// The main GL Account Setup panel
			'[xtype="glaccount.main"]': {
				// Run this whenever the user clicks on a tab on the GL Account Setup page
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('GLAccountSetup onTabChange() running');
					
					var activeTab = Ext.getClassName(newCard).split('.').pop();
					this.addHistory('GLAccountSetup:showGLAccountSetup:' + activeTab);
				}
			},
                        // The GLAccounts grid
			'[xtype="glaccount.glaccountsmain"] customgrid': {
				selectionchange: this.gridSelectionChange,
				itemclick      : this.viewGLAccount
			},
                        // The GLAccounts grid drop down
			'[xtype="glaccount.glaccountsmain"] [name="glaccount_status"]': {
				change: this.changeGLAccountStatus
			},
                        // The Create New GL Account
			'[xtype="glaccount.glaccountsmain"] [xtype="shared.button.new"]': {
				click: function() {
					this.addHistory('GLAccountSetup:showGLAccountSetup:GLAccounts:Form');
				}
			},
                        // The cancel button on the glaccount form
			'#glaccountCancelBtn': {
				click: function() {
					this.activeGLAccountRecord = null;
					this.addHistory('GLAccountSetup:showGLAccountSetup:GLAccounts:Main');
				}
			},
			// The save button on the glaccount form
			'#glaccountSaveBtn': {
				click: this.saveGlAccount
			},
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
		var tabPanel = that.setView('NP.view.glaccount.Main');

		// If no active tab is passed, default to Open
		if (!activeTab) activeTab = 'Overview';
		
		// Check if the tab to be selected is already active, if it isn't make it the active tab
		var tab = that.getCmp('glaccount.' + activeTab.toLowerCase());
		
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
		if (!subSection) subSection = 'Main';

		this['showGLAccounts' + subSection](glaccount_id);
	},

	showGLAccountsMain: function() {
		this.setView('NP.view.glaccount.GLAccountsMain', {}, '[xtype="glaccount.glaccounts"]');

		this.changeGLAccountStatus();
	},
                
        gridSelectionChange: function(selectionModel, selected) {
		var grid = this.getCmp('glaccount.glaccounts').query('customgrid')[0];
			
		var glaccount_status = grid.query('[name="glaccount_status"]')[0].getValue();
	},
        
        viewGLAccount: function(grid, rec, item, index, e) {
		if (e.getTarget().className != 'x-grid-row-checker') {
			this.addHistory('GLAccountSetup:showGLAccountSetup:GLAccounts:Form:' + rec.get('glaccount_id'));
		}
	},
        
        changeGLAccountStatus: function() {
		// Reload the grid
		var grid = this.getCmp('glaccount.glaccounts').query('customgrid')[0];
		var glaccount_status = grid.query('[name="glaccount_status"]')[0].getValue();
		grid.addExtraParams({ glaccount_status: glaccount_status });
		grid.reloadFirstPage();
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
                    extraFields: ['vendor_glaccounts']
                });
            }
       }

        var form = this.setView('NP.view.glaccount.GLAccountsForm', viewCfg, '[xtype="glaccount.glaccounts"]');
    },
    
    /**
     * Save GLAccountSetup
     */
    saveGlAccount: function() {
        var that = this;

        var form = this.getCmp('glaccount.glaccountsform');

        if (form.isValid()) {
            form.submitWithBindings({
                service: 'GLService',
                action: 'saveGlAccount',
                extraParams: {
                    glaccount_updateby: NP.Security.getUser().get('userprofile_id')
                },
                success: function(result, deferred) {
                    NP.Util.showFadingWindow({ html: that.saveSuccessText });
                    that.application.addHistory('GLAccountSetup:showGLAccountSetup');
                }
            });
        }
    },
});