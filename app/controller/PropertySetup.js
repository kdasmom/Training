/**
 * The PropertySetup controller deals with operations in the Administration > Property Setup section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.PropertySetup', {
	extend: 'Ext.app.Controller',
	
	requires: [
		'NP.lib.core.Security',
		'NP.lib.core.Net',
		'NP.lib.core.Util'
	],
	
	placeOnHoldDialogTitleText: 'Place On Hold?',
	placeOnHoldDialogText     : 'Are you sure you want to place the selected ' + NP.Config.getPropertyLabel(true).toLowerCase() + ' on hold?',
	onHoldSuccessText         : NP.Config.getPropertyLabel(true) + ' were placed on hold',
	onHoldFailureText         : 'There was an error placing ' + NP.Config.getPropertyLabel(true) + ' on hold',
	activateDialogTitleText : 'Activate?',
	activateDialogText      : 'Are you sure you want to activate the selected ' + NP.Config.getPropertyLabel(true).toLowerCase() + '?',
	activateSuccessText     : NP.Config.getPropertyLabel(true) + ' were activated',
	activateFailureText     : 'There was an error activating ' + NP.Config.getPropertyLabel(true),
	inactivateDialogTitleText : 'Inactivate?',
	inactivateDialogText      : 'Are you sure you want to inactivate the selected ' + NP.Config.getPropertyLabel(true).toLowerCase() + '?',
	inactivateSuccessText     : NP.Config.getPropertyLabel(true) + ' were inactivated',
	inactivateFailureText     : 'There was an error inactivating ' + NP.Config.getPropertyLabel(true),

	/**
	 * This store keeps track of all the additions/edits we make to fiscal calendars
	 * @private
	 */
	fiscalCalMonths: Ext.create('NP.store.property.FiscalCalMonths'),

	init: function() {
		Ext.log('PropertySetup controller initialized');

		var app = this.application;

		// Setup event handlers
		this.control({
			// The main Property Setup panel
			'[xtype="property.main"]': {
				// Run this whenever the user clicks on a tab on the Property Setup page
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('PropertySetup onTabChange() running');
					
					var activeTab = Ext.getClassName(newCard).split('.').pop();
					this.application.addHistory('PropertySetup:showPropertySetup:' + activeTab);
				}
			},
			// The Properties grid
			'[xtype="property.propertiesmain"] customgrid': {
				selectionchange: this.gridSelectionChange
			},
			// The main properties container that shows the grid
			'[xtype="property.propertiesmain"]': {
				itemeditclick: function(grid, rec, rowIndex) {
					this.application.addHistory('PropertySetup:showPropertySetup:Properties:Form:' + rec.get('property_id'));
				}
			},
			// The Property grid drop down
			'[xtype="property.propertiesmain"] [name="property_status"]': {
				change: this.changePropertyStatus
			},
			// The Place On Hold button
			'[xtype="property.propertiesmain"] [xtype="shared.button.hourglass"]': {
				click: this.placePropertyOnHold
			},
			// The Inactivate button
			'[xtype="property.propertiesmain"] [xtype="shared.button.inactivate"]': {
				click: this.inactivateProperty
			},
			// The Activate button
			'[xtype="property.propertiesmain"] [xtype="shared.button.activate"]': {
				click: this.activateProperty
			},
			// The Create New Property button
			'[xtype="property.propertiesmain"] [xtype="shared.button.new"]': {
				click: function() {
					this.application.addHistory('PropertySetup:showPropertySetup:Properties:Form');
				}
			},
			// The integration package combo box on the property form
			'[xtype="property.propertiesform"] [name="integration_package_id"]': {
				// Run this whenever the integration package is changed
				change: this.changeIntegrationPackage
			},
			// The add fiscal calendar button
			'[xtype="property.propertiesformcal"] #addFiscalCalBtn': {
				click: function() { this.addFiscalCal(); }
			},
			// The fiscal calendar grid on the add/edit properties page
			'[xtype="property.propertiesform"] [xtype="property.fiscalcalendargrid"]': {
				selectionchange: this.selectFiscalCalendar
			}
		});
	},
	
	/**
	 * Shows the main Property Setup page
	 * @param {String} [activeTab="Overview"] The tab currently active
	 * @param {String} [subSection]           The seubsection of the tab to open
	 * @param {String} [id]                   Id for an item being viewed
	 */
	showPropertySetup: function(activeTab, subSection, id) {
		var that = this;

		// Set the MySettings view
		var tabPanel = that.application.setView('NP.view.property.Main');

		// If no active tab is passed, default to Open
		if (!activeTab) activeTab = 'Overview';
		
		// Check if the tab to be selected is already active, if it isn't make it the active tab
		var tab = that.application.getComponent('property.' + activeTab.toLowerCase());
		
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

	showProperties: function(subSection, property_id) {
		if (!subSection) subSection = 'Main';

		this['showProperties' + subSection](property_id);
	},

	showPropertiesMain: function() {
		this.application.setView('NP.view.property.PropertiesMain', {}, '[xtype="property.properties"]');

		this.changePropertyStatus();
	},

	changePropertyStatus: function() {
		// Reload the grid
		var grid = this.application.getComponent('property.properties').query('customgrid')[0];
		var property_status = grid.query('[name="property_status"]')[0].getValue();
		grid.addExtraParams({ property_status: property_status });
		grid.reloadFirstPage();

		// Change the buttons that show in the toolbar
		var inactivateBtn = grid.query('[xtype="shared.button.inactivate"]')[0];
		var activateBtn = grid.query('[xtype="shared.button.activate"]')[0];
		var holdBtn = grid.query('[xtype="shared.button.hourglass"]')[0];
		inactivateBtn.hide();
		activateBtn.hide();
		holdBtn.hide();
	},

	gridSelectionChange: function(selectionModel, selected) {
		var grid = this.application.getComponent('property.properties').query('customgrid')[0];
		
		// Change the buttons that show in the toolbar
		var inactivateBtn = grid.query('[xtype="shared.button.inactivate"]')[0];
		var activateBtn = grid.query('[xtype="shared.button.activate"]')[0];
		var holdBtn = grid.query('[xtype="shared.button.hourglass"]')[0];
		
		var property_status = grid.query('[name="property_status"]')[0].getValue();

		var map = {
			'1': ['hourglass'],
			'-1': ['inactivate','activate'],
			'0': ['hourglass']
		};

		Ext.Array.each(map[property_status], function(btnName) {
			var btn = grid.query('[xtype="shared.button.' + btnName +'"]')[0];
			if (selected.length && !btn.isVisible()) {
				btn.show();
			} else if (!selected.length && btn.isVisible()) {
				btn.hide();
			}
		});
	},

	placePropertyOnHold: function() {
		// Call generic function to perform grid actions
		this.gridAction('setPropertiesOnHold', this.placeOnHoldDialogTitleText, this.placeOnHoldDialogText, this.onHoldSuccessText, this.onHoldFailureText);
	},

	inactivateProperty: function() {
		// Call generic function to perform grid actions
		this.gridAction('inactivateProperties', this.inactivateDialogTitleText, this.inactivateDialogText, this.inactivateSuccessText, this.inactivateFailureText);
	},

	activateProperty: function() {
		// Call generic function to perform grid actions
		this.gridAction('activateProperties', this.activateDialogTitleText, this.activateDialogText, this.activateSuccessText, this.activateFailureText);
	},

	gridAction: function(action, confirmDialogTitle, confirmDialogText, successDialogText, failureDialogText) {
		var that = this;

		// Show a confirmation dialog
		Ext.MessageBox.confirm(confirmDialogTitle, confirmDialogText, function(btn) {
			// If user clicks Yes, perform action
			if (btn == 'yes') {
				// Get the properties that were checked on the grid
				var grid = that.application.getComponent('property.properties').query('customgrid')[0];
				var properties = grid.getSelectionModel().getSelection();
				var property_id_list = [];
				Ext.each(properties, function(property) {
					property_id_list.push(property.get('property_id'));
				});

				// Make ajax request to perform action
				NP.lib.core.Net.remoteCall({
					mask: grid,
					requests: {
						service: 'PropertyService',
						action : action,
						userprofile_id: NP.Security.getUser().get('userprofile_id'),
						property_id_list: property_id_list,
						success: function(result, deferred) {
							// If operation successful
							if (result.success) {
								// Remove the row from the grid
								grid.getStore().remove(properties);
								// Show a friendly message saying action was successful
								NP.Util.showFadingWindow({ html: successDialogText });
							// If an error occurs
							} else {
								Ext.MessageBox.alert('Error', failureDialogText);
							}
						},
						failure: function(response, options, deferred) {
							Ext.MessageBox.alert('Error', failureDialogText);
						}
					}
				});
			}
		});
	},

	showPropertiesForm: function(property_id) {
		var that = this;

		// Setup the binding for the form
		var viewCfg = {
			bind: {
				models: [
		        	'property.Property',
		        	'contact.Address',
		        	'contact.Phone',
		        	{ class: 'contact.Phone', prefix: 'fax_' }
		        ]
		    }
		};

		// If editing a property, we need to configure a few more things
		if (property_id) {
			// Setup a listener to populate billto/shipto stores with default values so 
			// we don't have to preload them and they don't show up as just a number
			Ext.apply(viewCfg, {
				listeners: {
		        	beforefieldupdate: function(form, result) {
		        		var defaultBillToField = form.findField('default_billto_property_id');
		        		defaultBillToField.getStore().add({
		        			property_id: result['default_billto_property_id'],
		        			property_name: result['default_billto_property_name']
		        		});
		        		var defaultShipToField = form.findField('default_shipto_property_id');
		        		defaultShipToField.getStore().add({
		        			property_id: result['default_shipto_property_id'],
		        			property_name: result['default_shipto_property_name']
		        		});
		        	}
		        }
			});
			// Specify the service to use to retrieve the data for the property being edited
	    	Ext.apply(viewCfg.bind, {
				service    : 'PropertyService',
				action     : 'get',
				extraParams: {
					property_id: property_id
		        }
	    	});
	    }

		// Create the view
		var form = this.application.setView('NP.view.property.PropertiesForm', viewCfg, '[xtype="property.properties"]');

		var hideablePanels = ['property.propertiesformgl','property.propertiesformunits',
							'property.propertiesformunitmeasurements','property.propertiesformusers',
							'property.propertiesformuserreport'];

		// Make sure all hideable tabs are in the proper state (hidden for new record, showing for editing)
		Ext.Array.each(hideablePanels, function(panel) {
			panel = that.application.getComponent(panel);
			if (property_id) {
				panel.tab.show();
			} else {
				panel.tab.hide();
			}
		});

		var defaultBillToField = form.findField('default_billto_property_id');
		var defaultShipToField = form.findField('default_shipto_property_id');
		// Do the following only when creating a new property
		if (!property_id) {
			var intPkgField = form.findField('integration_package_id');
			var defaultIntPkg = intPkgField.getStore().query('universal_field_status', 2);
			// If there's a default integration package, select it by default
    		if (defaultIntPkg.getCount()) {
    			intPkgField.setValue(defaultIntPkg.getAt(0));
    		}

    		var regionField = form.findField('region_id');
			var defaultRegion = regionField.getStore().query('universal_field_status', 2);
    		if (defaultRegion.getCount()) {
    			regionField.setValue(defaultRegion.getAt(0));
    		}

    		var fiscalCalField = form.findField('fiscalcal_id');
    		fiscalCalField.getStore().load();
    		fiscalCalField.show();

    		defaultBillToField.hide();
			defaultShipToField.hide();
		// Do the following only when editing a property
		} else {
			defaultBillToField.show();
			defaultShipToField.show();
			form.findField('fiscalcal_id').hide();
		}
	},

	changeIntegrationPackage: function(combo, newVal, oldVal) {
		var property_gls = this.application.getComponent('property.propertiesform').findField('property_gls');

		// We need to clear the stores for the item selector, otherwise it'll keep adding new records to it
		property_gls.fromField.getStore().removeAll();
		property_gls.toField.getStore().removeAll();

		// Add the integration package to the GL account store parameters
		if (newVal !== null) {
			property_gls.getStore().getProxy().extraParams['integration_package_id'] = newVal;
			property_gls.getStore().load();
		}
	},

	addFiscalCal: function() {
		var form = this.application.getComponent('property.propertiesform');
		var fiscalcalField = form.findField('add_fiscalcal_id');
		// Only perform the add operation if a value is selected in the combo
		if (fiscalcalField.getValue() !== null) {
			// Get the record from the store
			var rec = fiscalcalField.getStore().findRecord('fiscalcal_id', fiscalcalField.getValue());
			// Copy the record to the grid store
			var grid = this.application.getComponent('property.fiscalcalendargrid');
			grid.getStore().add(rec);
			// Remove the record from the combo store
			fiscalcalField.getStore().remove(rec);
			// Clear the combo
			fiscalcalField.setValue(null);
		}
	},

	selectFiscalCalendar: function(grid, recs) {
		var form = this.application.getComponent('property.propertiesform');

		// Show the panel with the cutoff dates
		var cutoffPanel = Ext.ComponentQuery.query('#cutoffPanel')[0];
		cutoffPanel.show();

		// Get the cutoff days for the month
		NP.Net.remoteCall({
			mask: cutoffPanel,
			requests: {
				service     : 'PropertyService',
				action      : 'getFiscalCalMonths',
				fiscalcal_id: recs[0].get('fiscalcal_id'),
				store       : 'NP.store.property.FiscalCalMonths',
				success: function(store, deferred) {
					// Set all the values for the cutoff days
					for (var i=1; i<=12; i++) {
						var field = form.findField('fiscalcalmonth_cutoff_' + i);
						var rec = store.findRecord('fiscalcalmonth_num', i);
						field.setValue(rec.get('fiscalcalmonth_cutoff'));
					}
				},
				failure: function(response, options, deferred) {}
			}
		});
	}
});