/**
 * The PropertySetup controller deals with operations in the Administration > Property Setup section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.PropertySetup', {
	extend: 'NP.lib.core.AbstractController',
	
	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security',
		'NP.lib.core.Net',
		'NP.lib.core.Util',
        'NP.lib.core.Translator'
	],
	
	models: ['property.FiscalCal','system.IntegrationPackage','property.Region',
			'property.Property'],

	stores: ['property.FiscalCals','system.IntegrationPackages','property.Properties',
			'property.VolumeTypes','property.UnitTypes','property.Units'],

	views: ['property.Main','property.PropertiesMain','property.PropertiesForm'],
	
	init: function() {
		Ext.log('PropertySetup controller initialized');

		var me = this,
			unitText, propertyText, propertiesText;

		// For localization
		NP.Translator.on('localeloaded', function() {
			unitText       = NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit'),
			propertyText   = NP.Config.getPropertyLabel(),
			propertiesText = NP.Config.getPropertyLabel(true);
			
			me.errorDialogTitleText       = NP.Translator.translate('Error');
			me.placeOnHoldDialogTitleText = NP.Translator.translate('Place On Hold?');
			me.placeOnHoldDialogText      = NP.Translator.translate('Are you sure you want to place the selected {property} on hold?', { property: propertyText });
			me.onHoldSuccessText          = NP.Translator.translate('{properties} were placed on hold', { properties: propertiesText });
			me.onHoldFailureText          = NP.Translator.translate('There was an error placing {properties} on hold', { properties: propertiesText });
			me.activateDialogTitleText    = NP.Translator.translate('Activate') + '?';
			me.activateDialogText         = NP.Translator.translate('Are you sure you want to activate the selected {properties}?', { properties: propertiesText });
			me.activateSuccessText        = NP.Translator.translate('{properties} were activated', { properties: propertiesText });
			me.activateFailureText        = NP.Translator.translate('There was an error activating {properties}', { property: propertyText });
			me.inactivateDialogTitleText  = NP.Translator.translate('Inactivate') + '?';
			me.inactivateDialogText       = NP.Translator.translate('Are you sure you want to inactivate the selected {properties}?', { properties: propertiesText });
			me.inactivateSuccessText      = NP.Translator.translate('{properties} were inactivated', { properties: propertiesText });
			me.inactivateFailureText      = NP.Translator.translate('There was an error inactivating {properties}', { properties: propertiesText });
			me.changesSavedText           = NP.Translator.translate('Changes saved successfully');
			me.invalidDayErrorText        = NP.Translator.translate('Invalid day');
			me.unassignedUniTypeTitle     = NP.Translator.translate('View {unit} Not Assigned to a {unit} Type', { unit: unitText });
			me.newPropertyTitleText       = NP.Translator.translate('New {property}', { property: propertyText });
			me.editPropertyTitleText      = NP.Translator.translate('Editing');
		});

		// Setup event handlers
		this.control({
			// The main Property Setup panel
			'[xtype="property.main"]': {
				// Run this whenever the user clicks on a tab on the Property Setup page
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('PropertySetup onTabChange() running');
					
					var activeTab = Ext.getClassName(newCard).split('.').pop();
					this.addHistory('PropertySetup:showPropertySetup:' + activeTab);
				}
			},
			// The Properties grid
			'[xtype="property.propertiesmain"] customgrid': {
				selectionchange: this.gridSelectionChange,
				itemclick      : this.viewProperty
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
					this.addHistory('PropertySetup:showPropertySetup:Properties:Form');
				}
			},
			// The add fiscal calendar button
			'[xtype="property.propertiesformcal"] #addFiscalCalBtn': {
				click: this.addFiscalCal
			},
			// The fiscal calendar grid on the add/edit properties page
			'[xtype="property.fiscalcalendargrid"]': {
				selectionchange: this.selectFiscalCalendar
			},
			// The cancel button on the property form
			'#propertyCancelBtn': {
				click: function() {
					this.activePropertyRecord = null;
					this.addHistory('PropertySetup:showPropertySetup:Properties:Main');
				}
			},
			// The save button on the property form
			'#propertySaveBtn': {
				click: this.saveProperty
			},
			// The cancel button on the property form fiscal calendar panel
			'[xtype="property.fiscalcalendarform"] [xtype="shared.button.cancel"]': {
				click: this.cancelCalendarCutoffs
			},
			// The save button on the property form fiscal calendar panel
			'[xtype="property.propertiesformcal"] [xtype="shared.button.save"]': {
				click: this.savePropertyCalendarCutoffs
			},
			// The save button on the master closing calendar form
			'[xtype="property.calendar"] [xtype="shared.button.save"]': {
				click: this.saveCalendarCutoffs
			},
			// The add fiscal calendar button
			'[xtype="property.calendar"] [xtype="shared.button.new"]': {
				click: this.addMasterFiscalCal
			},
			// The unit grid on the add/edit properties page
			'[xtype="property.unitgrid"]': {
				selectionchange: this.selectUnit,
				itemclick      : this.viewUnit
			},
			// The cancel button on the property unit form
			'[xtype="property.unitform"] [xtype="shared.button.cancel"]': {
				click: this.cancelUnitForm
			},
			// The save button on the property unit form
			'[xtype="property.unitform"] [xtype="shared.button.save"]': {
				click: this.saveUnit
			},
			// The Add Unit button on the unit grid
			'[xtype="property.unitgrid"] [xtype="shared.button.new"]': {
				click: this.addUnit
			},
			// The Remove Unit button on the unit grid
			'[xtype="property.unitgrid"] [xtype="shared.button.delete"]': {
				click: this.removeUnits
			},
			// The Add Unit Type button on the unit type grid
			'[xtype="property.unittypegrid"] [xtype="shared.button.new"]': {
				click: this.addUnitType
			},
			// The View Unassigned Unit Types button on the unit type grid
			'[xtype="property.unittypegrid"] [xtype="shared.button.view"]': {
				click: this.viewUnassignedUnitTypes
			},
			// The unit type grid on the add/edit properties page
			'[xtype="property.unittypegrid"]': {
				itemclick: this.viewUnitType
			},
			// The cancel button on the property unit form
			'[xtype="property.unittypeform"] [xtype="shared.button.cancel"]': {
				click: this.cancelUnitTypeForm
			},
			// The save button on the property unit form
			'[xtype="property.unittypeform"] [xtype="shared.button.save"]': {
				click: this.saveUnitType
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
		var tabPanel = that.setView('NP.view.property.Main');

		// If no active tab is passed, default to Open
		if (!activeTab) activeTab = 'Properties';
		
		// Check if the tab to be selected is already active, if it isn't make it the active tab
		var tab = that.getCmp('property.' + activeTab.toLowerCase());
		
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
		this.setView('NP.view.property.PropertiesMain', {}, '[xtype="property.properties"]');

		this.changePropertyStatus();
	},

	changePropertyStatus: function() {
		// Reload the grid
		var grid = this.getCmp('property.properties').query('customgrid')[0];
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

	viewProperty: function(grid, rec, item, index, e) {
		if (e.getTarget().className != 'x-grid-row-checker') {
			this.addHistory('PropertySetup:showPropertySetup:Properties:Form:' + rec.get('property_id'));
		}
	},

	gridSelectionChange: function(selectionModel, selected) {
		var grid = this.getCmp('property.properties').query('customgrid')[0];
		
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
				var grid = that.getCmp('property.properties').query('customgrid')[0];
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
						success: function(result) {
							// If operation successful
							if (result.success) {
								// Remove the row from the grid
								grid.getStore().remove(properties);
								// Show a friendly message saying action was successful
								NP.Util.showFadingWindow({ html: successDialogText });
							// If an error occurs
							} else {
								Ext.MessageBox.alert(that.errorDialogTitleText, failureDialogText);
							}
						},
						failure: function(response, options) {
							Ext.MessageBox.alert(that.errorDialogTitleText, failureDialogText);
						}
					}
				});
			}
		});
	},

	showPropertiesForm: function(property_id) {
		var that = this;

		// Do an Ajax request first to retrieve property custom field data since we need it for the form
		NP.lib.core.Net.remoteCall({
			requests: {
				service                 : 'ConfigService',
				action                  : 'getCustomFieldData',
				customfield_pn_type     : 'property',
				customfielddata_table_id: (property_id) ? property_id : 0,
				success                 : function(result) {
					// Setup the binding for the form
					var viewCfg = {
						customFieldData: result,
						bind: {
							models: [
					        	'property.Property',
					        	'contact.Address',
					        	'contact.Phone',
					        	{ classPath: 'contact.Phone', prefix: 'fax_' }
					        ]
					    }
					};

					// If editing a property, we need to configure a few more things
					if (property_id) {
						// Setup a listener to populate some fields
						Ext.apply(viewCfg, {
							listeners: {
					        	beforefieldupdate: function(form, result) {
					        		// Save the record for the property being edited for later use
					        		that.activePropertyRecord = that.getCmp('property.propertiesform').getModel('property.Property');

					        		// Set the form title
					        		form.setTitle(that.editPropertyTitleText + ' ' + that.activePropertyRecord.get('property_name') + ' (' + that.activePropertyRecord.get('property_id_alt') + ')');

					        		// Populate billto/shipto stores with default values so 
					        		var defaultBillToField = form.findField('default_billto_property_id');
					        		defaultBillToField.getStore().addExtraParams({ property_id: property_id });
					        		defaultBillToField.getStore().add({
					        			property_id: result['default_billto_property_id'],
					        			property_name: Ext.util.Format.htmlDecode(result['default_billto_property_name'])
					        		});
					        		var defaultShipToField = form.findField('default_shipto_property_id');
					        		defaultShipToField.getStore().addExtraParams({ property_id: property_id });
					        		defaultShipToField.getStore().add({
					        			property_id: result['default_shipto_property_id'],
					        			property_name: Ext.util.Format.htmlDecode(result['default_shipto_property_name'])
					        		});

					        		// Load the GL Store
					        		if (form.findField('property_gls')) {
						        		var glStore = form.findField('property_gls').getStore();
						        		glStore.addExtraParams({ integration_package_id: result['integration_package_id'] });
						        		glStore.load();
					        		}

					        		// Store the accounting period
					        		that.accountingPeriod = result['accounting_period']['date'].split(' ')[0];
					        		that.accountingPeriod = that.accountingPeriod.split('-');
					        		that.accountingPeriod = new Date(that.accountingPeriod[0], that.accountingPeriod[1]-1, that.accountingPeriod[2]);
					        	},
								dataloaded: function(form, data) {

									var intPkgField = form.findField('integration_package_id');
									var intPkgNameField = form.findField('integration_package_name');
									intPkgNameField.setValue(intPkgField.getRawValue());

                                    var propertySalesTax = form.findField('property_salestax');
                                    propertySalesTax.setValue(parseFloat(data.property_salestax) * 100);
								}
					        },
							property_id: property_id
						});
						// Specify the service to use to retrieve the data for the property being edited
				    	Ext.apply(viewCfg.bind, {
							service    : 'PropertyService',
							action     : 'get',
							extraParams: {
								property_id: property_id
					        },
					        extraFields: ['property_gls','property_users']
				    	});
				    }

				    // Suspend layouts for better performance
				    Ext.suspendLayouts();

					// Create the view
					var form = that.setView('NP.view.property.PropertiesForm', viewCfg, '[xtype="property.properties"]');

					var hideablePanels = ['property.propertiesformgl','property.propertiesformcal','property.propertiesformunits',
										'property.propertiesformunitmeasurements','shared.userassigner',
										'property.propertiesformuserreport'];

					// Make sure all hideable tabs are in the proper state (hidden for new record, showing for editing)
					Ext.Array.each(hideablePanels, function(panel) {
						panel = Ext.ComponentQuery.query('[xtype="'+panel+'"]');
						if (panel.length) {
							panel = panel[0];
							if (property_id) {
								panel.tab.show();
							} else {
								panel.tab.hide();
							}
						}
					});

					var defaultBillToField = form.findField('default_billto_property_id');
					var defaultShipToField = form.findField('default_shipto_property_id');
					var intPkgField = form.findField('integration_package_id');
					var intPkgNameField = form.findField('integration_package_name');
					// Do the following only when creating a new property
					if (!property_id) {
						// Set the form title
						form.setTitle(that.newPropertyTitleText);

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

			    		intPkgField.enable();
						intPkgNameField.hide();
			    		defaultBillToField.hide();
						defaultShipToField.hide();
					// Do the following only when editing a property
					} else {
						defaultBillToField.show();
						defaultShipToField.show();
						intPkgField.disable();
						intPkgField.hide();
						intPkgNameField.show();
						form.findField('fiscalcal_id').allowBlank = true;
						form.findField('fiscalcal_id').hide();

						// Populate parameter of fiscal calendar drop-down
						form.findField('add_fiscalcal_id').getStore()
														  .addExtraParams({ property_id: property_id });

						// Load Closing Calendars grid
						var calGridStore = form.query('[xtype="property.fiscalcalendargrid"]')[0].getStore();
		        		calGridStore.addExtraParams({ property_id: property_id });
		        		calGridStore.load();

		        		// Load the Unit Store
		        		var unitGrid = form.query('[xtype="property.unitgrid"]');
		        		if (unitGrid.length) {
			        		var unitStore = unitGrid[0].getStore();
			        		unitStore.addExtraParams({ property_id: property_id });
			        		unitStore.load();

			        		// Add parameters for unittype store if it's needed
			        		if (NP.Config.getSetting('VC_isOn') == '1') {
			        			var unitTypeStore = form.findField('unittype_id').getStore();
			        			unitTypeStore.addExtraParams({ property_id: property_id });
			        			unitTypeStore.load();

			        			unitTypeStore = that.getCmp('property.unittypegrid').getStore();
			        			unitTypeStore.addExtraParams({ property_id: property_id });
			        			unitTypeStore.load();
			        		}
			        	}
					}

					// Resume layouts now that fields and tabs have been updated
					Ext.resumeLayouts(true);
				},
				failure: function(response, options) {}
			}
		});
	},

	addFiscalCal: function(button, e) {
		var form = button.up('[xtype="property.propertiesform"]');
		var property_id = form.getModel('property.Property').get('property_id');
		var fiscalcalField = form.findField('add_fiscalcal_id');
		// Only perform the add operation if a value is selected in the combo
		if (fiscalcalField.getValue() !== null) {
			// Get the record from the store
			var rec = fiscalcalField.getStore().findRecord('fiscalcal_id', fiscalcalField.getValue());
			// Remove the record from the combo store
			fiscalcalField.getStore().remove(rec);
			// Set the property_id on the record and clear the fiscalcal_id
			rec.set('property_id', property_id);
			rec.set('fiscalcal_id', null);
			rec.set('fiscalcal_type', 'assigned');
			// Copy the record to the grid store
			var grid = form.down('[xtype="property.fiscalcalendargrid"]');
			grid.getStore().add(rec);
			// Clear the combo
			fiscalcalField.setValue(null);
		}
	},

	selectFiscalCalendar: function(selModel, recs) {
		// Show the panel with the cutoff dates
		var cutoffPanel = selModel.view.up('customgrid').nextNode('[xtype="property.fiscalcalendarform"]');

		var form = cutoffPanel.getForm();

		// The fiscal calendar year cannot be edited
		form.findField('fiscalcal_year').disable();

		if (recs.length) {
			this.selectedFiscalCal = recs[0];
			
			form.loadRecord(this.selectedFiscalCal);

			// Set all the values for the cutoff days
			var fiscalCalMonths = recs[0].months().getRange();
			Ext.Array.each(fiscalCalMonths, function(fiscalCalMonth) {
				var field = form.findField('fiscalcalmonth_cutoff_' + fiscalCalMonth.get('fiscalcalmonth_num'));
				field.setValue(fiscalCalMonth.get('fiscalcalmonth_cutoff'));
			});

			// Figure out which fields should be enabled and which should be disabled
			this.setCalendarCutoffState(form);
			cutoffPanel.show();
		} else {
			this.selectedFiscalCal = null;
			cutoffPanel.hide();
		}
	},

	setCalendarCutoffState: function(form) {
		var now = new Date();
		for (var i=1; i<=12; i++) {
			var compareDate = new Date(form.findField('fiscalcal_year').getValue(), i-1, 1);
			var field = form.findField('fiscalcalmonth_cutoff_' + i);
			if (this.accountingPeriod > compareDate || (
					this.accountingPeriod === compareDate && (
						this.accountingPeriod.getMonth() > now.getMonth() || field.getValue() >= now.getDate()
					)
				)
			) {
				field.disable();
			} else {
				field.enable();
			}
		}
	},

	saveProperty: function(button, e) {
		var that = this;

		var form = button.up('[xtype="property.propertiesform"]');
		
		// Setup validation options to include some sub forms from validation
		var validationOptions = {
			excludedForms: ['[xtype="property.unitform"]','[xtype="property.unittypeform"]','[xtype="property.fiscalcalendarform"]']
		};
		if (form.isValid(validationOptions)) {
			// Get the custom property fields to add them to the submission funtion
			var extraFields = {};
			Ext.Array.each(form.customFieldData, function(field) {
				extraFields[field['customfield_name']] = field['customfield_name'];
			});

			// Add Closing Calendar field
			extraFields['fiscalcal_id'] = 'fiscalcal_id';

			// Add GL Assignment field
			extraFields['property_gls'] = 'property_gls';

			// Add User Assignment field
			extraFields['property_users'] = 'property_users';
			
			// Default extra parameters
			var extraParams = {
				userprofile_id              : NP.Security.getUser().get('userprofile_id'),
				delegation_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id')
			}

			// Add fiscal calendar info as extra params
			extraParams['fiscalcals'] = [];
			
			// Get all fiscal calendars in the grid
			var calGrid = form.down('[xtype="property.fiscalcalendargrid"]');
			var fiscalcals = calGrid.getStore().getRange();

			// Loop through all fiscal calendars
			Ext.Array.each(fiscalcals, function(fiscalcal) {
				// If fiscal calendar is new or was changed or if there are updated months,
				// add to list of fiscal calendars for submission
				if (fiscalcal.dirty || fiscalcal.months().getUpdatedRecords().length) {
					extraParams['fiscalcals'].push(fiscalcal.getData(true));
				}
			});

			// Add unit info as extra params
			extraParams['units'] = [];
			// Get all new and updated units from the grid			
			var unitGrid = this.getCmp('property.unitgrid');
			var units = unitGrid.getStore().getModifiedRecords();

			// Loop through all units
			Ext.Array.each(units, function(unit) {
				extraParams['units'].push(unit.getData());
			});

			// Add removed units as extra params
			extraParams['removedUnits'] = [];
			// Get all new and updated units from the grid			
			units = unitGrid.getStore().getRemovedRecords();

			// Loop through all units
			Ext.Array.each(units, function(unit) {
				extraParams['removedUnits'].push(unit.getData());
			});

			// Add unit type info as extra params
			extraParams['unitTypes'] = [];
			// Get all new and updated units from the grid			
			var unitTypeGrid = this.getCmp('property.unittypegrid');
			var unitTypes = unitTypeGrid.getStore().getModifiedRecords();

			// Loop through all unit types
			Ext.Array.each(unitTypes, function(unitType) {
				extraParams['unitTypes'].push(unitType.getData(true));
			});

			// Submit the form
			form.submitWithBindings({
				service: 'PropertyService',
				action : 'saveProperty',
				extraFields: extraFields,
				extraParams: extraParams,
				success: function(result) {
					// If dealing with a new record, redirect
					var propertyModel = form.getModel('property.Property');
					if (propertyModel.get('property_id') === null) {
						that.addHistory('PropertySetup:showPropertySetup:Properties:Form:' + result.id);
						propertyModel.set('property_id', result.id);
					} else {
						// Reload the fiscal calendar store if needed to get new primary keys
						if (calGrid.getStore().getNewRecords().length) {
							calGrid.getStore().load();
				    	} else {
				    		calGrid.getStore().commitChanges()
				    	}

				    	// Reload the fiscal calendar store if needed to get new primary keys
				    	if (unitGrid.getStore().getNewRecords().length) {
				    		unitGrid.getStore().load();
				    	} else {
				    		unitGrid.getStore().commitChanges()
				    	}

				    	// Reload the fiscal calendar store if needed to get new primary keys
				    	if (unitTypeGrid.getStore().getNewRecords().length) {
				    		unitTypeGrid.getStore().load();
				    	} else {
				    		unitTypeGrid.getStore().commitChanges()
				    	}
				    }

					// Show info message
					NP.Util.showFadingWindow({ html: that.changesSavedText });
				}
			});
		}
	},

	cancelCalendarCutoffs: function(button, e) {
		var form = button.up('[xtype="property.fiscalcalendarform"]');
		form.hide();
		form.getForm().reset();
		var grid = button.previousNode('[xtype="property.fiscalcalendargrid"]');
		grid.getSelectionModel().deselectAll();
		this.selectedFiscalCal = null;
	},

	savePropertyCalendarCutoffs: function(button, e) {
		var form = button.up('[xtype="property.fiscalcalendarform"]');
		var grid = form.previousNode('[xtype="property.fiscalcalendargrid"]');
		var isValid = this.saveCalendarCutoffsToStore(grid, form);

		if (isValid) {
			this.cancelCalendarCutoffs(button);
		} 
	},

	saveCalendarCutoffsToStore: function(grid, form) {
		var that = this;

		form = form.getForm();
		var fiscalCal = this.selectedFiscalCal;
		// If dealing with a new calendar, we need to create the record
		if (fiscalCal === null) {
			fiscalCal = Ext.create('NP.model.property.FiscalCal');
			for (var i=1; i<=12; i++) {
				fiscalCal.months().add({
					fiscalcalmonth_num   : i
				});
			}
		}
		var fiscalCalMonths = fiscalCal.months().getRange();
		var isValid = true;
		var saveValues = {};
		var now = new Date();
		now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		var year = fiscalCal.get('fiscalcal_year');

		Ext.Array.each(fiscalCalMonths, function(fiscalCalMonth) {
			var month = fiscalCalMonth.get('fiscalcalmonth_num');
			var field = form.findField('fiscalcalmonth_cutoff_' + month);
			var day = field.getValue();

			if (NP.Util.isValidDayOfMonth(year, month, day)) {
				var cutoffDate = new Date(year, month-1, day);
				if (that.accountingPeriod.getMonth() == (month-1) && that.accountingPeriod.getFullYear() == year
					&& now > cutoffDate
				) {
					field.markInvalid(that.invalidDayErrorText);
					isValid = false;
				} else {
					saveValues[month] = day;
				}
			} else {
				field.markInvalid(that.invalidDayErrorText);
				isValid = false;
			}
		});

		if (isValid) {
			fiscalCal.set({
				fiscalcal_name: form.findField('fiscalcal_name').getValue(),
				fiscalcal_year: form.findField('fiscalcal_year').getValue()
			});

			Ext.Array.each(fiscalCalMonths, function(fiscalCalMonth) {
				var month = fiscalCalMonth.get('fiscalcalmonth_num');
				fiscalCalMonth.set('fiscalcalmonth_cutoff', saveValues[month]);
			});

			if (this.selectedFiscalCal === null) {
				grid.getStore().add(fiscalCal);
			}
		}

		return isValid;
	},

	viewUnit: function(grid, rec, item, index, e) {
		if (e.getTarget().className != 'x-grid-row-checker') {
			var form = this.getCmp('property.unitform');

			form.setTitle('Edit ' + NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit'));
			this.activeUnitRecord = rec;
			form.loadRecord(this.activeUnitRecord);

			if (form.isHidden()) {
				form.show();
			}
		}
	},

	selectUnit: function(grid, recs) {
		// Enable or disable the Remove Unit button
		var grid = this.getCmp('property.unitgrid');
		
		var removeBtn = grid.query('[xtype="shared.button.delete"]')[0];
		
		if (recs.length) {
			removeBtn.enable();
		} else {
			removeBtn.disable();
		}
	},

	addUnit: function() {
		var form = this.getCmp('property.unitform');
		form.setTitle('Add ' + NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit'));
		form.getForm().reset();
		this.activeUnitRecord = null;
		form.getForm().findField('unittype_id').getStore().reload();

		if (form.isHidden()) {
			form.show();
		}
	},

	cancelUnitForm: function() {
		this.getCmp('property.unitform').hide();
		this.activeUnitRecord = null;
	},

	saveUnit: function() {
		var that = this;

		var form = this.getCmp('property.unitform');
		
		if (form.getForm().isValid()) {
			var unitTypeStore = form.getForm().findField('unittype_id').getStore();
			var data = form.getValues();
			data['unittype_name'] = unitTypeStore.query('unittype_id', data.unittype_id).getAt(0).get('unittype_name');
			// If dealing with a new record, we need to add it to the grid
			if (this.activeUnitRecord === null) {
				this.getCmp('property.unitgrid').getStore().add(data);
			// Otherwise just update the existing record with new values
			} else {
				this.activeUnitRecord.set(data);
			}

			this.cancelUnitForm();
		}
	},

	removeUnits: function() {
		var grid = this.getCmp('property.unitgrid');
		grid.getStore().remove(grid.getSelectionModel().getSelection());
		this.cancelUnitForm();
	},

	viewUnitType: function(grid, rec, item, index, e) {
		if (e.getTarget().className != 'x-grid-row-checker') {
			var form = this.getCmp('property.unittypeform');
			var mask = new Ext.LoadMask({ target: form });
			mask.show();

			form.setTitle('Edit ' + NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit'));
			this.activeUnitTypeRecord = rec;
			form.loadRecord(this.activeUnitTypeRecord);

			var vals = rec.vals().getRange();
			Ext.Array.each(vals, function(val) {
				var fieldName = 'unittype_val_' + val.get('unittype_meas_id') + '_' + val.get('unittype_material_id');
				form.getForm().findField(fieldName).setValue(val.get('unittype_val_val'));
			});

			var unitsField = form.getForm().findField('units');
			var unitStore = unitsField.getStore();
			unitStore.addExtraParams({
				property_id: this.activePropertyRecord.get('property_id'),
				unittype_id: rec.get('unittype_id')
			});
			unitStore.load(function() {
				unitsField.setValue(rec.units().getRange());
				mask.destroy();
			});

			if (form.isHidden()) {
				form.show();
			}
		}
	},

	addUnitType: function() {
		var form = this.getCmp('property.unittypeform');
		form.setTitle('Add ' + NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit'));
		form.getForm().reset();
		this.activeUnitTypeRecord = null;

		var unitsField = form.getForm().findField('units');
		var unitStore = unitsField.getStore();
		unitStore.addExtraParams({
			property_id: this.activePropertyRecord.get('property_id'),
			unittype_id: null
		});

		var mask = new Ext.LoadMask({ target: form });
		mask.show();

		unitStore.load(function() {
			mask.destroy();
		});

		if (form.isHidden()) {
			form.show();
		}
	},

	cancelUnitTypeForm: function() {
		this.getCmp('property.unittypeform').hide();
		this.activeUnitTypeRecord = null;
	},

	saveUnitType: function() {
		var that = this;
		
		var form = this.getCmp('property.unittypeform');
		
		if (form.getForm().isValid()) {
			var data = form.getValues();
			
			// Set the values for the main unit type record
			var rec = {
				unittype_name        : data['unittype_name'],
				unittype_bedrooms    : data['unittype_bedrooms'],
				unittype_bathrooms   : data['unittype_bathrooms']
			};

			// Set the value for the UnitTypeVal hasMany association
			var vals = Ext.getStore('property.UnitTypeMeasurements').getRange();
			var valRecs = [];
			Ext.Array.each(vals, function(val, idx) {
				var fieldName = 'unittype_val_' + val.get('unittype_meas_id') + '_' + val.get('unittype_material_id');
				valRecs.push({
					unittype_material_id: val.get('unittype_material_id'),
					unittype_meas_id    : val.get('unittype_meas_id'),
					unittype_val_val    : form.getForm().findField(fieldName).getValue()
				});
			});

			var assignedUnitStore = form.getForm().findField('units').toField.getStore();
			
			// If dealing with a new record, we need to add it to the grid
			if (this.activeUnitTypeRecord === null) {
				rec = this.getCmp('property.unittypegrid').getStore().add(rec);
				rec[0].vals().add(valRecs);
				rec[0].units().add(assignedUnitStore.getRange());
				rec[0].set('unittype_updated_date', new Date());
			// Otherwise just update the existing record with new values
			} else {
				this.activeUnitTypeRecord.set(rec);
				Ext.Array.each(valRecs, function(valRec, idx) {
					var val = that.activeUnitTypeRecord.vals().queryBy(function(record) {
						if (record.get('unittype_meas_id') == valRec['unittype_meas_id'] && record.get('unittype_material_id') == valRec['unittype_material_id']) {
							return true;
						}
						return false;
					}).getAt(0);
					val.set(valRec);
				});
				// We need to jump through hoops to make sure we only make the parent record dirty when needed
				var unitStore = this.activeUnitTypeRecord.units();
				for (var i=0; i<unitStore.getCount(); i++) {
					var unitRec = unitStore.getAt(i);
					if (assignedUnitStore.find('unit_id', unitRec.get('unit_id')) == -1) {
						unitStore.removeAt(i);
					}
				}
				for (i=0; i<assignedUnitStore.getCount(); i++) {
					var unitRec = assignedUnitStore.getAt(i);
					if (unitStore.find('unit_id', unitRec.get('unit_id')) == -1) {
						unitStore.add(unitRec);
					}
				}

				// If we determine we've made changes, change the updated date to make sure the parent record
				// is dirty and gets submitted
				if (this.activeUnitTypeRecord.dirty
					|| this.activeUnitTypeRecord.vals().getModifiedRecords()
					|| this.activeUnitTypeRecord.units().getModifiedRecords()) {
					this.activeUnitTypeRecord.set('unittype_updated_date', new Date());
				}
			}

			this.cancelUnitTypeForm();
		}
	},

	viewUnassignedUnitTypes: function() {
		var win = Ext.Msg.show({
			title      : this.unassignedUniTypeTitle,
			msg        : '',
			width      : 300,
			padding: 8,
			buttons    : Ext.Msg.OK,
			icon       : Ext.window.MessageBox.INFO
		});

		NP.lib.core.Net.remoteCall({
			mask    : win,
			requests: {
				service    : 'PropertyService',
				action     : 'getUnitsWithoutType',
				property_id: this.activePropertyRecord.get('property_id'),
				success: function(result) {
					var unit_list = NP.Util.valueList(result, 'unit_number');
					unit_list = unit_list.join(',');
					if (unit_list == '') {
						unit_list = 'None';
					}
					win.update(unit_list);
				}
			}
		});
	},

	showCalendar: function() {
		var now = new Date();
		now = new Date(now.getFullYear(), now.getMonth(), 1);
		this.accountingPeriod = now;
	},

	addMasterFiscalCal: function(button, e) {
		this.selectedFiscalCal = null;

		var cutoffPanel = button.nextNode('[xtype="property.fiscalcalendarform"]');
		cutoffPanel.getForm().reset();

		var fields = cutoffPanel.getForm().getFields();
		fields.each(function(field) { field.enable(); });

		cutoffPanel.show();
	},

	saveCalendarCutoffs: function(button, e) {
		var that = this;
		var isNewRecord = false;

		var form = button.up('[xtype="property.fiscalcalendarform"]');
		var calGrid = form.previousNode('[xtype="property.fiscalcalendargrid"]');

		var isValid = this.saveCalendarCutoffsToStore(calGrid, form);

		if (isValid) {
			var modifiedFiscalCal = this.selectedFiscalCal;
			

			if (modifiedFiscalCal === null) {
				modifiedFiscalCal = calGrid.getStore().getNewRecords()[0];
				isNewRecord = true;
			}

			NP.lib.core.Net.remoteCall({
				method  : 'POST',
				requests: {
					service: 'PropertyService',
					action : 'saveFiscalCal',
					data   : modifiedFiscalCal.getData(true),
					success: function(result) {
						if (result.success) {
							// Close form panel
							that.cancelCalendarCutoffs(button);

							// Only reload the grid if new records were created to easily update the primary key
							if (isNewRecord) {
								calGrid.getStore().load();
							} else {
								calGrid.getStore().commitChanges();
							}

							// Show info message
							NP.Util.showFadingWindow({ html: that.changesSavedText });
						} else {
							if (isNewRecord) {
								calGrid.getStore().remove(modifiedFiscalCal);
							}
							Ext.MessageBox.alert(that.errorDialogTitleText, result.errors[0].msg);
						}
					}
				}
			});
		}
	}
});