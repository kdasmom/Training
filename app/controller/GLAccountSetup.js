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
		{ ref: 'glaccountEditBtn', selector: '[xtype="gl.glaccountsgrid"] [xtype="shared.button.edit"]' },
		{ ref: 'glaccountDistributiveVendorsBtn', selector: '#distributiveToAllVendors' },
		{ ref: 'glaccountDistributivePropertiesBtn', selector: '#distributiveToAllProperties' },
		{ ref: 'glaccountForm', selector: '[xtype="gl.glaccountsform"]' },
        ],
	
        // For localization
        changesSavedText          : 'Changes saved successfully',

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
                        '[xtype="gl.glaccountsgrid"] [xtype="shared.button.edit"]' : {
                                click : this.viewGLAccount
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
				click: this.saveGlAccount
			},
                        // The cancel button on the glcategory form
			'#glcategoryCancelBtn': {
				click: 	function() {
                                    this.addHistory('GLAccountSetup:showGLAccountSetup:Overview');
                                }
			},
			// The save button on the glcategory form
			'#glcategorySaveBtn': {
				click: this.saveGlCategory
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
		this.getGlaccountDistributiveVendorsBtn()[fn]();
		this.getGlaccountDistributivePropertiesBtn()[fn]();
	},
        
        viewGLAccount: function(grid, rec, item, index, e) {
		if (e.getTarget().className != 'x-grid-row-checker') {
			this.addHistory('GLAccountSetup:showGLAccountSetup:GLAccounts:Form:' + rec.get('glaccount_id'));
		}
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
                    extraFields: ['glaccount_vendors', 'glaccount_properties', 'glaccount_category']
                });
            }
       }

        var form = this.setView('NP.view.gl.GLAccountsForm', viewCfg, '[xtype="gl.glaccounts"]');
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
                success: function(result, deferred) {
                    NP.Util.showFadingWindow({ html: that.changesSavedText });
                }
            });
        }
    },
    /**
     * Save GL Category
     */
    saveGlCategory: function() {
        var that = this;

        var form = this.getCmp('gl.category');

        if (form.isValid()) {
            form.submitWithBindings({
                service: 'GLService',
                action: 'saveGlAccount',
                extraParams: {
                    glaccount_updateby: NP.Security.getUser().get('userprofile_id')
                },
                success: function(result, deferred) {
                    NP.Util.showFadingWindow({ html: that.changesSavedText });
                }
            });
        }
    },
});