/**
 * The Invoice controller deals with operations in the Image Management section of the app
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.controller.ImageManagement', {
	extend: 'NP.lib.core.AbstractController',
	
	requires: ['NP.lib.core.Config'],
	
	stores: ['image.ImageIndexes'],
	
	init: function() {
		Ext.log('Image Management controller initialized');

		var app = this.application;

		// Setup event handlers
		this.control({
			// Clicking on an Image Register tab
			'[xtype="imagemanagement.management"] tabpanel': {
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('ImageManagement.onTabChange() running');
					
					var activeTab = newCard.getItemId().replace('image_grid_', '').toLowerCase();
					this.addHistory('ImageManagement:showManagement:' + activeTab);
				}
			},
			// Clicking on an invoice in an Invoice Register grid
			'[xtype="imagemanagement.management"] tabpanel > grid': {
				itemclick: function(gridView, record, item, index, e, eOpts) {
					this.addHistory( 'ImageManagement:showView:' + record.get('image_index_id') );
				}
			},
			// Making a change to the context picker (picking from drop-down or clicking radio button)
			'#imageManagementContextPicker': {
				change: function(toolbar, filterType, selected) {
					var contentView = app.getCurrentView();
					// If user picks a different property/region and we're on a register, update the grid
					if (contentView.getXType() == 'image.imagemanagement') {
						var activeTab = contentView.query('tabpanel')[0].getActiveTab();
						if (activeTab.getStore) {
							this.loadManagementGrid(activeTab);
						}
					}
				}
			}
		});
	},
	
	/**
	 * Reloads a register grid, passing the current context to its store proxy, and moving it back to page 1
	 * @private
	 * @param {Ext.grid.Panel} grid
	 */
	loadManagementGrid: function(grid) {
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
	showManagement: function(activeTab) {
		// Set the register view
		this.setView('NP.view.imageManagement.Management');

		// If no active tab is passed, default to Open
		if (!activeTab) var activeTab = 'indexed';
		
		// Check if the tab to be selected is already active, if it isn't make it the active tab
		var tab = Ext.ComponentQuery.query('#image_grid_' + activeTab)[0];
		var tabPanel = Ext.ComponentQuery.query('tabpanel')[0];
		
		// Set the active tab if it hasn't been set yet
		if (tab.getItemId() != tabPanel.getActiveTab().getItemId()) {
			tabPanel.setActiveTab(tab);
		}
		
		// Load the store
		this.loadManagementGrid(tab);
	},
	
	/**
	 * Shows the image add/edit page
	 * @param {Number} [image_index_id] Id of the image to edit; if not provided, will show page for adding image
	 */
	showView: function(image_index_id) {
		Ext.log('ImageManagement.showView('+image_index_id+') running');
		
		this.setView('NP.view.imageManagement.View');
	}
});