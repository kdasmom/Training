/**
 * The Po controller deals with operations in the Purchase Order section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.Po', {
	extend: 'NP.controller.AbstractEntityController',
	
	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security',
		'NP.lib.core.Net',
		'NP.lib.core.Translator',
		'NP.lib.core.Util',
		'NP.lib.ui.Uploader',
		'NP.lib.core.KeyManager'
	],
	
	//models: ['invoice.PoItem'],

	stores: ['po.Purchaseorders'/*,'system.PriorityFlags','po.PoItems','shared.Reasons',
			'image.ImageIndexes','shared.RejectionNotes'*/],
	
	views: ['po.Register'/*,'po.View','shared.invoicepo.ImagesManageWindow','shared.invoicepo.ImagesAddWindow',
			'invoice.UseTemplateWindow','shared.invoicepo.SplitWindow','shared.invoicepo.RejectWindow'*/],

	refs: [
		{ ref: 'poView', selector: '[xtype="po.view"]' },
		{ ref: 'poViewToolbar', selector: '[xtype="po.viewtoolbar"]' }
	],

	showPoImage: true,

	init: function() {
		Ext.log('Po controller initialized');

		var me  = this,
			app = me.application;

		// Setup event handlers
		me.control({
			// Clicking on an Invoice Register tab
			'[xtype="po.register"]': {
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('Po.onTabChange() running');
					
					var activeTab = newCard.getItemId().replace('po_grid_', '').toLowerCase();
					me.addHistory('Po:showRegister:' + activeTab);
				}
			},
			
			// Clicking on an invoice in an PO Register grid
			'[xtype="po.register"] > grid': {
				itemclick: function(gridView, record, item, index, e, eOpts) {
					me.addHistory( 'Po:showView:' + record.get('purchaseorder_id') );
				}
			},

			// Clicking on the New Invoice button
			'#newPoBtn,#newPoMenuBtn': {
				click: function() {
					me.addHistory('Po:showView');
				}
			},
			
			// Clicking on cancel button on the invoice view page
			'[xtype="po.viewtoolbar"] [xtype="shared.button.cancel"]': {
				click: function() {
					Ext.util.History.back();
				}
			},

			// Making a change to the context picker (picking from drop-down or clicking radio button)
			'#poRegisterContextPicker': {
				change: function(toolbar, filterType, selected) {
					var contentView = app.getCurrentView();
					// If user picks a different property/region and we're on a register, update the grid
					if (contentView.getXType() == 'po.register') {
						var activeTab = contentView.getActiveTab();
						if (activeTab.getStore) {
							me.loadRegisterGrid(activeTab);
						}
					}
				}
			},
		});

		//me.setKeyboardShortcuts();
	},

	/**
	 * Reloads a register grid, passing the current context to its store proxy, and moving it back to page 1
	 * @private
	 * @param {Ext.grid.Panel} grid
	 */
	loadRegisterGrid: function(grid) {
		var state = Ext.ComponentQuery.query('[xtype="shared.contextpicker"]')[0].getState();
		grid.addExtraParams({
			contextType     : state.type,
			contextSelection: state.selected
		});

		grid.reloadFirstPage();
	},

	/**
	 * Shows the invoice register page with a specific tab open
	 * @param {String} [activeTab="open"] The tab currently active
	 */
	showRegister: function(activeTab) {
		// Set the register view
		this.setView('NP.view.po.Register');

		// If no active tab is passed, default to Open
		if (!activeTab) var activeTab = 'open';
		
		// Check if the tab to be selected is already active, if it isn't make it the active tab
		var tab = Ext.ComponentQuery.query('#po_grid_' + activeTab)[0];
		var tabPanel = Ext.ComponentQuery.query('tabpanel')[0];
		
		// Set the active tab if it hasn't been set yet
		if (tab.getItemId() != tabPanel.getActiveTab().getItemId()) {
			tabPanel.setActiveTab(tab);
		}
		
		// Load the store
		this.loadRegisterGrid(tab);
	}
});