/**
 * The SystemSetup controller deals with operations in the System Setup section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.SystemSetup', {
	extend: 'NP.lib.core.AbstractController',
	
	requires: [
	    'NP.lib.core.Security',
	    'NP.lib.core.Net',
	    'NP.lib.core.Util',
	    'NP.lib.core.Config',
    	'NP.lib.core.Translator',
    	'Ext.form.field.Hidden',
    	'NP.store.invoice.InvoicePaymentTypes'
	],

	models: ['system.DfSplit'],

	stores: [
		'property.Properties','gl.GlAccounts','system.DfSplits','system.ConfigSysLkpVals',
		'system.PrintTemplates','workflow.WfRules','workflow.WfRuleTypes',
		'invoice.InvoicePaymentTypes','workflow.Originates'
	],

	views: [
		'systemSetup.Main',
		'systemSetup.DefaultSplitGrid',
		'systemSetup.DefaultSplitForm',
		'systemSetup.SettingsTab',
		'systemSetup.CustomFieldForm',
		'systemSetup.TemplatesGrid',
		'systemSetup.PropertyAssignmentsWindow',
		'systemSetup.PrintTemplateViewImageWindow',
		'systemSetup.PrintTemplateViewAttachmentWindow',
		'systemSetup.WorkflowRulesMain',
		'systemSetup.WorkflowRulesView',
		'systemSetup.WorkflowRulesModify'
	],

	refs : [
		{ ref: 'passwordConfiguration', selector: '[xtype="systemsetup.passwordconfiguration"]' },
		{ ref: 'defaultSplits',		    selector: '[xtype="systemsetup.defaultsplits"]' },
		{ ref: 'defaultSplitGrid',	    selector: '[xtype="systemsetup.defaultsplitgrid"] customgrid' },
		{ ref: 'splitDeleteBtn',		selector: '[xtype="systemsetup.defaultsplitgrid"] [xtype="shared.button.delete"]' },
		{ ref: 'defaultSplitForm',	    selector: '[xtype="systemsetup.defaultsplitform"]' },
		{ ref: 'splitFormItemGrid',	    selector: '[xtype="systemsetup.defaultsplitform"] customgrid' },
		{ ref: 'splitFormVendor',	    selector: '[xtype="systemsetup.defaultsplitform"] [xtype="shared.vendorautocomplete"]' },
		{ ref: 'splitFormIntPkg',	    selector: '[xtype="systemsetup.defaultsplitform"] [name="integration_package_id"]' },
		{ ref: 'splitGridVendorCombo',  selector: '[xtype="systemsetup.defaultsplitform"] [xtype="shared.vendorautocomplete"]' },
		{ ref: 'splitGridPropertyCombo',selector: '#splitGridPropertyCombo' },
		{ ref: 'splitGridGlCombo',	    selector: '#splitGridGlCombo' },
		{ ref: 'splitGridUnitCombo',	selector: '#splitGridUnitCombo' },
		{ ref: 'addSplitAllocBtn',	    selector: '#addSplitAllocBtn' },
		{ ref: 'workflowScreen',		selector: '[xtype="systemsetup.workflowrulesmain"]' },
		{ ref: 'workflowRulesGrid',		selector: '[xtype="systemsetup.workflowrulesgrid"] customgrid' },
		{ ref: 'workflowActivateBtn', 	selector: '[xtype="systemsetup.workflowrulesgrid"] [xtype="shared.button.activate"]' },
		{ ref: 'workflowInactivateBtn', selector: '[xtype="systemsetup.workflowrulesgrid"] [xtype="shared.button.inactivate"]' },
		{ ref: 'workflowCopyBtn', 		selector: '[xtype="systemsetup.workflowrulesgrid"] [xtype="shared.button.copy"]' },
		{ ref: 'workflowDeleteBtn', 	selector: '[xtype="systemsetup.workflowrulesgrid"] [xtype="shared.button.delete"]' },
		{ ref: 'workflowOriginatesGrid',selector: '[xtype="systemsetup.workfloworiginatesgrid"]'},
		{ ref: 'WorkflowConflictingRulesGrid',selector: '[xtype="systemsetup.workflowconflictingrulesgrid"]'}
	],
	settingsActiveTab: 'general',
	
	init: function() {
		Ext.log('SystemSetup controller initialized');

		var me = this;

		// For localization
		NP.Translator.on('localeloaded', function() {
			me.changesSavedText	      = NP.Translator.translate('Changes saved successfully');
			me.errorDialogTitleText   = NP.Translator.translate('Error');
			me.deleteSplitDialogTitle = NP.Translator.translate('Delete Split?');
			me.deleteSplitsDialogText = NP.Translator.translate('Are you sure you want to delete the selected split(s)?');
			me.deleteSplitDialogText  = NP.Translator.translate('Are you sure you want to delete this split?');
			me.editSplitFormTitle	  = NP.Translator.translate('Editing');
			me.newSplitFormTitle	  = NP.Translator.translate('New Split');
			me.intPkgChangeDialogTitle= NP.Translator.translate('Change integration package?');
			me.intPkgChangeDialogText = NP.Translator.translate('Are you sure you want to change integration package? Doing so will clear the entire form, removing all splits you have entered.');
			me.deleteRuleDialogTitle  = NP.Translator.translate('Delete rule?');
			me.deleteRuleDialogText   = NP.Translator.translate('Are you sure you want to delete selected rules?');
			me.deleteForwardTitle     = NP.Translator.translate('Delete Forward?');
			me.deleteForwardText      = NP.Translator.translate('Are you sure you want to delete this \'Forward\' from this rule?');
			me.ignoreSaveRouteTitle   = NP.Translator.translate('Warning!');
			me.ignoreSaveRouteText    = NP.Translator.translate('Originates From/Forward To information must be complete before the rule can be activated. Continue?');
		});

		// Setup event handlers
		me.control({
			// The main System Setup panel
			'[xtype="systemsetup.main"]': {
				// Run this whenever the user clicks on a tab on the System Setup page
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('SystemSetup onTabChange() running');

					var activeTab = Ext.getClassName(newCard).split('.').pop();
					me.addHistory('SystemSetup:showSystemSetup:' + activeTab);
				}
			},
			// The Save button on the Password Configuration page
			'[xtype="systemsetup.passwordconfiguration"] [xtype="shared.button.save"]': {
				// Run this whenever the save button is clicked
				click: me.savePasswordConfiguration
			},
			// The Split grid
			'[xtype="systemsetup.defaultsplitgrid"] customgrid': {
				// Making a selection on the grid
				selectionchange: me.selectSplit,
				cellclick: function(view, td, cellIndex, rec, tr, rowIndex, e) {
					if (cellIndex != 0) {
						me.addHistory('SystemSetup:showSystemSetup:DefaultSplits:Form:' + rec.get('dfsplit_id'));
					}
				}
			},
			// The Create New Split button
			'[xtype="systemsetup.defaultsplitgrid"] [xtype="shared.button.new"]': {
				click: function() {
					me.addHistory('SystemSetup:showSystemSetup:DefaultSplits:Form');
				}
			},
			// The Delete button on the split grid
			'[xtype="systemsetup.defaultsplitgrid"] [xtype="shared.button.delete"]': {
				click: me.deleteSplits
			},
			// The default split form integration package field
			'[xtype="systemsetup.defaultsplitform"] [name="integration_package_id"]': {
				select: function(combo) { me.selectIntegrationPackage(combo, true) }
			},
			// The default split form allocation grid
			'[xtype="systemsetup.defaultsplitform"] customgrid': {
				beforeedit: function(editor, e) {
					if (e.field == 'property_id') {
						me.openPropertyEditor(e.record);
					} else if (e.field == 'glaccount_id') {
						me.openGlAccountEditor(e.record);
					} else if (e.field == 'unit_id') {
						me.openUnitEditor(e.record);
					}
				},
				deleterow: me.deleteSplitItem,
				updateproperty: me.updateProperty
			},
			'#saveSplitFormBtn': {
				click: me.saveSplitForm
			},
			'#copySplitFormBtn': {
				click: me.copySplit
			},
			'#deleteSplitFormBtn': {
				click: me.deleteSplit
			},
			'#resetSplitFormBtn': {
				click: me.resetSplitForm
			},
			'#cancelSplitFormBtn': {
				click: function() {
					me.addHistory('SystemSetup:showSystemSetup:DefaultSplits');
				}
			},
			'#addSplitAllocBtn': {
				click: me.addSplitLine
			},
			'#autoAllocBtn': {
				click: me.autoAllocSplit
			},

			'#buttonWorkflowCancel': {
				click: function() {
					me.addHistory('SystemSetup:showSystemSetup');
				}
			},
			'#buttonWorkflowBackToMain': {
				click: function() {
					me.addHistory('SystemSetup:showSystemSetup:WorkflowRules');
				}
			},
			'#buttonWorkflowCreateRule': {
				click: function() {
					me.addHistory('SystemSetup:showSystemSetup:WorkflowRules:modify');
				}
			},
			'#buttonWorkflowEditRule': {
				click: function() {
					var wfrule_id = me.getCmp('systemsetup.workflowrulesview').data.rule.wfrule_id;
					me.addHistory('SystemSetup:showSystemSetup:WorkflowRules:modify:' + wfrule_id);
				}
			},
			'#buttonWorkflowPrint': {
				click: function() {
					Ext.MessageBox.alert('Print', 'Coming soon')
				}
			},
			'#buttonWorkflowReport': {
				click: function() {
					Ext.MessageBox.alert('Report', 'Coming soon')
				}
			},
			'#buttonWorkflowActivateRules': {
				click: this.workflowRulesChangeStatus.bind(this, 1)
			},
			'#buttonWorkflowDeactivateRules': {
				click: this.workflowRulesChangeStatus.bind(this, 2)
			},
			'#buttonWorkflowSaveAndActivate': {
				click: function(){
					var rule = me.getCmp('systemsetup.workflowrulesmodify').data;

					if (!rule.routes.length) {
						Ext.MessageBox.confirm(me.ignoreSaveRouteTitle, me.ignoreSaveRouteText, function(btn) {
							if (btn == 'yes') {
								me.saveAndActivateWorkflowRule();
							}
						});
					}
					else {
						me.saveAndActivateWorkflowRule();
					}
				}
			},
			'#buttonWorkflowActivate': {
				click: function() {
					var wfrule_id = me.getCmp('systemsetup.workflowrulesmodify').data.rule.wfrule_id,
						grid = this.getWorkflowOriginatesGrid();

					if (!grid.store.getCount()) {
						Ext.MessageBox.confirm(me.ignoreSaveRouteTitle, me.ignoreSaveRouteText, function(btn) {
							if (btn == 'yes') {
								me.activateWorkflowRule(wfrule_id);
							}
						});
					}
					else {
						me.activateWorkflowRule(wfrule_id);
					}
				}
			},
			'#buttonWorkflowAddForward': {
				click: this.saveWorkflowRoute
			},
			'#buttonWorkflowDeactivateRule': {
				click: function() {
					var wfrule_id = me.getCmp('systemsetup.workflowrulesmodify').down('[name="wfrule_id"]').value;
					me.changeRuleStatus([wfrule_id], 2);
					me.addHistory('SystemSetup:showSystemSetup:WorkflowRules');
				}
			},
			'#buttonWorkflowCopyRules': {
				click: this.workflowCopyRules.bind(this)
			},
			'#buttonWorkflowCopyRule': {
				click: function() {
					var wfrule_id = me.getCmp('systemsetup.workflowrulesmodify').data.rule.wfrule_id;
					this.workflowCopyRule(wfrule_id, this.openNewWorkflowRule);
				}
			},
			'#buttonWorkflowDeleteRules': {
				click: this.workflowDeleteRules.bind(this)
			},
			'#buttoneNextOnConflictPage': {
				click: this.decisionRuleConflict
			},
			'#buttonWorkflowNext': {
				click: me.saveWorkflowRule
			},

			'[xtype="systemsetup.workflowrulesgrid"] customgrid': {
				selectionchange: this.selectRule,
				cellclick: this.workflowCellClickProcess.bind(this)
			},
			'[xtype="systemsetup.workfloworiginatesgrid"]': {
				cellclick: function(gridView, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					var grid = this.getWorkflowOriginatesGrid();

					if (cellIndex == 4 && e.target.tagName == 'IMG') {
						Ext.MessageBox.confirm(me.deleteForwardTitle, me.deleteForwardText, function(btn) {
							if (btn == 'yes') {
								NP.lib.core.Net.remoteCall({
									requests: {
										service: 'WFRuleService',
										action: 'DeleteRuleRoute',
										wfactionid: record.get('wfaction_id'),
										success: function() {
											grid.getStore().remove(record);
										}
									}
								});
							}
						});
					}
				}
			},

			'#saveClientLogoBtn': {
				click: me.saveClientLogo
			},
			'#removeClientLogoBtn': {
				click: me.removeClientLogo
			},
			'#backToUserManagerBtn': {
				click: function() {
					me.addHistory('UserManager:showUserManager');
				}
			},
			'#backToPropertySetupBtn': {
				click: function() {
					me.addHistory('PropertySetup:showPropertySetup');
				}
			},
			'[xtype="systemsetup.settings"] [xtype="verticaltabpanel"]': {
				tabchange: me.changeSettingsTab
			},
			'[xtype="systemsetup.settings"] [xtype="shared.button.save"]': {
				click: me.saveSettings
			},
			'#backToOverview': {
				click: function() {
					me.addHistory('SystemSetup:showSystemSetup:Overview');
				}
			},
			'[xtype="systemsetup.settings"] [xtype="shared.button.cancel"]': {
				click: function() {
					me.addHistory('SystemSetup:showSystemSetup:Overview');
				}
			},
			'[xtype="systemsetup.customfields"] [xtype="systemsetup.customfieldslineitem"] [xtype="customgrid"]': {
				itemclick: function(dataview, record) {
					me.showFieldEditForm(dataview, record, true);
				}
			},
			'[xtype="systemsetup.customfields"] [xtype="systemsetup.customfieldsheader"] [xtype="customgrid"]': {
				itemclick: function(dataview, record) {
					me.showFieldEditForm(dataview, record, false);
				}
			},
			'[xtype="systemsetup.customfields"] [xtype="systemsetup.customfieldspropertyfields"] [xtype="customgrid"]': {
				itemclick: function(dataview, record) {
					me.showFieldEditForm(dataview, record, false);
				}
			},
			'[xtype="systemsetup.customfields"] [xtype="systemsetup.customfieldsservicefields"] [xtype="customgrid"]': {
				itemclick: function(dataview, record) {
					me.showFieldEditForm(dataview, record, false);
				}
			},
			'#saveCustomFieldBtn': {
				click: me.saveCustomField
			},
			'[xtype="systemsetup.customfields"]': {
				beforehidetab: me.changeCustomFieldsTab
			},
			'[xtype="systemsetup.picklists"] verticaltabpanel': {
				tabchange: me.loadPicklistColumns
			},
			'[xtype="systemsetup.picklists"] [name="picklistcolumns"]': {
				itemclick: me.loadPicklistForm
			},
			'[xtype="systemsetup.picklists"] [name="picklistfields"] [xtype="shared.button.save"]': {
				click: me.savePicklist
			},
			'[xtype="systemsetup.picklists"] [name="picklistfields"] [xtype="shared.button.cancel"]': {
				click: me.resetPickListForm
			},
			'[xtype="systemsetup.poprintsettings"] [xtype="shared.button.new"]': {
				click: function() {
					me.addHistory('SystemSetup:showSystemSetup:POPrintSettings:PrintTemplate');
				}
			},
			'[xtype="systemsetup.poprintsettings"] [xtype="systemsetup.templatesgrid"]': {
				cellclick: function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					var colText = grid.getHeaderAtIndex(cellIndex).text;
					if (colText != NP.Translator.translate('Assigned To') && colText != NP.Translator.translate('View Attachment')) {
						me.addHistory('SystemSetup:showSystemSetup:POPrintSettings:PrintTemplate:' + record.get('Print_Template_Id') + (colText == NP.Translator.translate('Copy') ? (':copy') : ''));
					} else {
						if (colText == NP.Translator.translate('Assigned To')) {
							me.showTemplatePropertyAssignmentWindow(record.get('Print_Template_Id'));
						} else {
							var templateObj = JSON.parse(record.get('Print_Template_Data'));
							if (templateObj.template_attachment && templateObj.template_attachment !== '0') {
								var win = Ext.create('NP.view.systemSetup.PrintTemplateViewAttachmentWindow', {templateid: record.get('Print_Template_Id')});
								win.show();
							}
						}
					}
				}
			},
			'[xtype="systemsetup.poprintsettings"] [xtype="systemsetup.templatesmanager"] [xtype="shared.button.cancel"]': {
				click: function(button) {
					if (button.name !== 'canceluploadbtn') {
						me.addHistory('SystemSetup:showSystemSetup:POPrintSettings');
					}
				}
			},
			'[xtype="systemsetup.canvaspanel"]': {
				addtemplateitem: me.addTemplateItem,
				removetemplateitem: me.removeTemplateItem
			},
			'[xtype="systemsetup.templatesmanager"]': {
				savetemplate: me.savePrintTemplate,
				deletetemplate: me.deletePrintTemplate,
				uploadattachment: me.showUploadAttachment,
				uploadimage: me.showUploadImage
			},
			'[xtype="systemsetup.templatesmanager"] verticaltabpanel': {
				tabchange      : me.changepotabs
			}
		});
	},

	// enable or disable buttons of rules grid
	selectRule: function(selectionModel, selected) {
		var fn = (selected.length) ? 'enable' : 'disable';

		this.getWorkflowActivateBtn()[fn]();
		this.getWorkflowInactivateBtn()[fn]();
		this.getWorkflowCopyBtn()[fn]();
		this.getWorkflowDeleteBtn()[fn]();
	},

	showWorkflowRules: function(section, ruleid) {
		var me = this;

		switch (section) {
			case 'modify':
				if (ruleid) {
					NP.lib.core.Net.remoteCall({
						requests: {
							service: 'WFRuleService',
							action : 'get',
							mode: 'edit',
							id: ruleid,
							success: function(data) {
								if (data) {
									me.setView('NP.view.systemSetup.WorkflowRulesModify', {data: data}, '[xtype="systemsetup.workflowrules"]', true);
								}
							}
						}
					});
				}
				// Only do this if we're creating a new rule
				else {
					me.setView('NP.view.systemSetup.WorkflowRulesModify', {}, '[xtype="systemsetup.workflowrules"]');
				}
				break;
			case 'view':
				NP.lib.core.Net.remoteCall({
					requests: {
						service: 'WFRuleService',
						action : 'get',
						mode: 'view',
						id: ruleid,
						success: function(data) {
							if (data) {
								me.setView('NP.view.systemSetup.WorkflowRulesView', {data: data}, '[xtype="systemsetup.workflowrules"]');
							}
						}
					}
				});
				break;
			default:
				this.setView('NP.view.systemSetup.WorkflowRulesMain', {}, '[xtype="systemsetup.workflowrules"]');
		}
	},

	workflowCellClickProcess: function(view, td, cellIndex, rec, tr, rowIndex, e) {
		var me = this;

		switch (cellIndex) {
			case 0:
				// Selection. Nothing to do.
				break;
			default:
				me.addHistory('SystemSetup:showSystemSetup:WorkflowRules:view:' + rec.get('wfrule_id'));
				break;
		}
	},

	workflowRulesChangeStatus: function(status) {
		var me = this,
			grid = this.getWorkflowRulesGrid();

		if (grid) {
			var selection = grid.getSelectionModel().getSelection();

			if (selection) {
				var identifiers = [];

				for (var i = 0, l = selection.length; i < l; i++) {
					identifiers.push(selection[i].internalId);
				}
				if (identifiers.length) {
					me.changeRuleStatus(identifiers, status, this.reloadWorkflowGrid);
				}
			}
		}
	},

	reloadWorkflowGrid: function(me) {
		var grid = me.getWorkflowRulesGrid();

		if (grid) {
			grid.getSelectionModel().deselectAll();
			grid.store.reload();
		}
	},

	changeRuleStatus: function(identifiers, status, callback) {
		var me = this;
		callback = callback || Ext.emptyFn;

		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'WFRuleService',
				action : 'changeStatus',
				id: identifiers,
				status: status,
				success: function(data) {
					if (data.success) {
						callback(me);
					}
				}
			}
		});
	},

	/**
	 * Copy selected rules
	 */
	workflowCopyRules: function() {
		var me = this,
			selectedRules = me.getSelectedRules(),
			mask = new Ext.LoadMask({
				target: me.getWorkflowScreen()
			});

		mask.show();
		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'WFRuleService',
				action : 'copyRules',

				ruleIdList: selectedRules.join(),

				success: function(data) {
					if (data) {
						mask.destroy();

						grid = me.getWorkflowRulesGrid();
						grid.getSelectionModel().deselectAll();
						grid.store.reload();
					}
				}
			}
		});
	},

	/**
	 * Copy rule
	 */
	workflowCopyRule: function(wfrule_id, callback) {
		callback = callback || Ext.emptyFn;

		var me = this;

		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'WFRuleService',
				action : 'copy',
				id: wfrule_id,
				success: function(data) {
					if (data.success) {
						callback(data.ruleid, me);
					}
				}
			}
		});
	},

	openNewWorkflowRule: function(ruleid, me) {
		me.addHistory('SystemSetup:showSystemSetup:WorkflowRules:modify:' + ruleid);
	},

	/**
	 * Delete selected rules
	 */
	workflowDeleteRules: function() {
		var me = this;

		Ext.MessageBox.confirm(
			me.deleteRuleDialogTitle,
			me.deleteRuleDialogText,
			function(button) {
				if (button == 'yes') {
					var mask = new Ext.LoadMask({
						target: me.getWorkflowScreen()
					});
					mask.show();

					var selectedRules = me.getSelectedRules();

					NP.lib.core.Net.remoteCall({
						requests: {
							service: 'WFRuleService',
							action : 'deleteRules',
							ruleIdList: selectedRules.join(),

							success: function(data) {
								if (data) {
									mask.destroy();
									var grid = me.getWorkflowRulesGrid();
									grid.getSelectionModel().deselectAll();
									grid.store.reload();
								}
							}
						}
					});
				}
			}
		);
	},

	/**
	 * returns a list id of selected rules
	 * @returns {Array} list id
	 */
	getSelectedRules: function() {
		var identifiers = [],
			grid = this.getWorkflowRulesGrid();

		if (grid) {
			var selection = grid.getSelectionModel().getSelection();
			if (selection) {
				for (var i = 0, l = selection.length; i < l; i++) {
					identifiers.push(selection[i].internalId);
				}
			}
		}

		return identifiers;
	},



	/**
	 * Shows the system setup page
	 * @param {String} [activeTab="open"] The tab currently active
	 * @param {String} [subSection]	   The seubsection of the tab to open
	 * @param {String} [id]			   Id for an item being viewed
	 */
	showSystemSetup: function(activeTab, subSection, id, copy) {
		var that = this;

		// Set the SystemSetup view
		var tabPanel = that.setView('NP.view.systemSetup.Main');

		// If no active tab is passed, default to Open
		if (!activeTab) activeTab = 'Overview';
			
		// Check if the tab to be selected is already active, if it isn't make it the active tab
		var tab = that.getCmp('systemsetup.' + activeTab.toLowerCase());
			
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
			that[showMethod](subSection, id, copy);
		}

		if (activeTab == 'Settings') {
			var generaltab = tab.down('#general');

			this.filltabContent(generaltab, this.addField);
		}
	},

	showPOPrintSettings: function(subpanel, id, copy) {
		var me = this;

		subpanel = !subpanel ? 'TemplatesGrid' : subpanel;

		if (me['show' + subpanel]) {
			me['show' + subpanel](id, copy);
		}
	},
	
	/**
	 * Displays the page for the Password Configuration tab
	 */
	showPasswordConfiguration: function() {
		var form = this.getPasswordConfiguration();

		NP.lib.core.Net.remoteCall({
			requests: {
				service	: 'ConfigService',
				action	 : 'getPasswordConfiguration',
				success	: function(result) {
					//Formating results to integer so value types will match expecting values for form, needed for combobox
					for( i in result){
						result[i] = parseInt(result[i]);
					}
					// Set values in Form using results
					form.getForm().setValues(result);
				}
			}
		});
	},

	/**
	 * Save Password Configuration
	 */
	savePasswordConfiguration: function() {
		var that = this;
		var form = this.getPasswordConfiguration();

		if (form.getForm().isValid()) {
			var values = form.getValues();
			
			NP.lib.core.Net.remoteCall({
				requests: {
					service	: 'ConfigService',
					action	 : 'setPasswordConfiguration',
					data	   : values,
					success	: function(result) {
						// If save is successful, run success callback
						if (result.success) {
							//Setting new password configuration settings
							for(i in values){
								NP.Config.setSetting(i, values[i]);
							}
						}else{
							// Only try to process results if there's an errors array
							if (result.errors && result.errors instanceof Array) {
								Ext.each(result.errors, function(error) {
									if (error.field == 'global') {
										Ext.MessageBox.alert('Error', error.msg);
										return false;
									} else {
										var field = form.getForm().findField(error.field);
										if (field) {
											field.markInvalid(error.msg);
										}
									}
								});
								var invalidFields = form.getForm().findInvalid();
								if (invalidFields.getCount()) {
									invalidFields.getAt(0).ensureVisible();
								}
							}
						}
					}
				}
			});
		}
	},

	showDefaultSplits: function(subSection, dfsplit_id) {
		if (!subSection) subSection = 'Grid';

		this['showDfSplit' + subSection](dfsplit_id);
	},

	showDfSplitGrid: function() {
		this.setView('NP.view.systemSetup.DefaultSplitGrid', {}, '[xtype="systemsetup.defaultsplits"]');
		
		this.getDefaultSplitGrid().getStore().load();
	},

	selectSplit: function(selectionModel, selected) {
		var fn = (selected.length) ? 'enable' : 'disable';
		this.getSplitDeleteBtn()[fn]();
	},

	deleteSplits: function() {
		var that = this;

		Ext.MessageBox.confirm(this.deleteSplitDialogTitle, this.deleteSplitsDialogText, function(btn) {
			// If user clicks Yes, proceed with deleting
			if (btn == 'yes') {
				var grid = that.getDefaultSplitGrid();
				var splits = grid.getSelectionModel().getSelection();
				var dfsplit_id = [];
				Ext.each(splits, function(split) {
					grid.getStore().remove(split);
					dfsplit_id.push(split.get('dfsplit_id'));
				});

				that.deleteSplitAction(
					dfsplit_id,
					grid,
					{
						success: function() {
							// Unmark items in the grid
							grid.getStore().commitChanges();
						},
						failure: function() {
							grid.getStore().rejectChanges();
						}
					}
				);
			}
		});
	},

	deleteSplitAction: function(dfsplit_id, mask, callbacks) {
		var that = this;
		var callbacks = callbacks || {};

		NP.lib.core.Net.remoteCall({
			method  : 'POST',
			mask	: mask,
			requests: {
				service   : 'SplitService',
				action	: 'deleteSplit',
				dfsplit_id: dfsplit_id,
				success: function(result) {
					if (result.success) {
						if (callbacks.success) {
							callbacks.success();
						}
						// Show a friendly message saying action was successful
						NP.Util.showFadingWindow({ html: that.changesSavedText });
					} else {
						if (callbacks.failure) {
							callbacks.failure();
						}
						NP.Util.showFadingWindow({ html: result.error });
					}
				}
			}
		});
	},

	showDfSplitForm: function(dfsplit_id) {
		var that = this;

		// Setup the view configuration
		var viewCfg = {
			bind: {
				models: [
					'system.DfSplit'
				]
			}
		};

		// Only do this if viewing an existing user
		if (dfsplit_id) {
			Ext.apply(viewCfg, {
				listeners	   : {
					dataloaded: function(formPanel, data) {
						// Set the form title
						formPanel.setTitle(that.editSplitFormTitle + ' ' + data['dfsplit_name']);

						// Set the active user for easy access later
						that.activeSplit = formPanel.getModel('system.DfSplit');

						var grid = that.getSplitFormItemGrid();
						grid.addExtraParams({ dfsplit_id: dfsplit_id });
						grid.getStore().load();

						// Load the integration
						that.selectIntegrationPackage(formPanel.findField('integration_package_id'), false);

						// Set the vendor record
						if (data['vendor_id'] !== null) {
							that.getSplitGridVendorCombo().setDefaultRec(Ext.create('NP.model.vendor.Vendor', {
								vendor_id	: data['vendor_id'],
								vendor_name  : data['vendor_name'],
								vendor_id_alt: data['vendor_id_alt'],
								vendorsite_id: data['vendorsite_id']
							}));
							that.getSplitGridVendorCombo().resetOriginalValue();
						}
					}
				}
			});

			Ext.apply(viewCfg.bind, {
				service: 'SplitService',
				action : 'get',
				extraParams: {
					dfsplit_id: dfsplit_id
				}
			});
		}

		// Create the view with the configuration defined above
		var form = that.setView('NP.view.systemSetup.DefaultSplitForm', viewCfg, '[xtype="systemsetup.defaultsplits"]', true);

		var copyBtn = Ext.ComponentQuery.query('#copySplitFormBtn')[0];
		var deleteBtn = Ext.ComponentQuery.query('#deleteSplitFormBtn')[0];

		Ext.suspendLayouts();
		
		// Only do this if we're editing a user
		if (dfsplit_id) {
			copyBtn.show();
			deleteBtn.show();
		}
		// Only do this if we're creating a new user
		else {
			// Set the form title
			form.setTitle(that.newSplitFormTitle);
			copyBtn.hide();
			deleteBtn.hide();
		}

		Ext.resumeLayouts(true);
	},

	selectIntegrationPackage: function(combo, showWarning) {
		var that = this;

		function selectIntPkg() {
			var integration_package_id = combo.getValue();

			// When changing the integration package, you basically clear the entire form
			// since everything depends on it
			that.getSplitFormVendor().clearValue();
			if (integration_package_id === null) {
				that.getSplitFormVendor().disable();
				that.getAddSplitAllocBtn().disable();
			} else {
				that.getSplitFormVendor().getStore().addExtraParams({ integration_package_id: integration_package_id });
				that.getSplitFormVendor().enable();
				that.getAddSplitAllocBtn().enable();
			}
			// Remove items one at a time, otherwise we can't reset the form
			var store = that.getSplitFormItemGrid().getStore();
			var lineItems = store.getRange();
			Ext.Array.each(lineItems, function(lineItem) {
				store.remove(lineItem);
			});

			// Reload the property store
			if (that.getSplitGridPropertyCombo()) {
				that.openPropertyEditor();
				that.getSplitGridPropertyCombo().getStore().load();
			}

			combo.setFocusValue(combo.getValue());
		}

		if (showWarning && combo.getFocusValue() !== null && combo.getFocusValue() != combo.getValue()) {
			Ext.MessageBox.confirm(that.intPkgChangeDialogTitle, that.intPkgChangeDialogText, function(btn) {
				// If user clicks Yes, proceed with deleting
				if (btn == 'yes') {
					selectIntPkg();
				} else {
					combo.setValue(combo.getFocusValue());
				}
			});
		} else {
			selectIntPkg();
		}
	},

	openPropertyEditor: function(rec) {
		var me	= this,
			store = me.getSplitGridPropertyCombo().getStore(),
			combo = me.getSplitGridPropertyCombo();

		me.addIntegrationPkgToStore(store);
		store.load(function() {
			combo.setValue(rec.get('property_id'));
		});
	},

	updateProperty: function(store, rec) {
		if (rec.get('property_id') !== null) {
			// Only run this if a GL value is selected and property/GL association is on
			if (rec.get('glaccount_id') !== null && NP.Config.getSetting('CP.PROPERTYGLACCOUNT_USE') == '1') {
				// make sure the GL account is valid for the property selected
				NP.lib.core.Net.remoteCall({
					requests: {
						service	 : 'PropertyService',
						action	  : 'isGlAssigned',
						property_id : rec.get('property_id'),
						glaccount_id: rec.get('glaccount_id'),
						success	 : function(result) {
							// If the GL is not assigned to the property, clear it
							if (!result) {
								rec.set('glaccount_id', null);
							}
						}
					}
				});
			}
		} else {
			rec.set('glaccount_id', null);
		}
	},

	openGlAccountEditor: function(rec) {
		var me	= this,
			combo = me.getSplitGridGlCombo(),
			store = combo.getStore();

		// Only run this if property/GL association is on
		if (NP.Config.getSetting('CP.PROPERTYGLACCOUNT_USE') == '1') {
			var property_id = rec.get('property_id');

			if (property_id !== null) {
				if (property_id != store.getExtraParam('property_id')) {
					store.addExtraParams({ property_id: property_id });
					store.load(function() {
						combo.setValue(rec.get('glaccount_id'));
					});
				}
			} else {
				store.removeAll();
			}
		// Otherwise run code for associating with integration package
		} else {
			me.addIntegrationPkgToStore(store);
			store.load(function() {
				combo.setValue(rec.get('glaccount_id'));
			});
		}
	},

	openUnitEditor: function(rec) {
		var me		  = this,
			combo	   = me.getSplitGridUnitCombo(),
			store	   = combo.getStore(),
			property_id = rec.get('property_id');

		if (property_id !== null) {
			if (property_id != store.getExtraParam('property_id')) {
				store.addExtraParams({ property_id: property_id });
				store.load(function() {
					combo.setValue(rec.get('unit_id'));
				});
			}
		} else {
			store.removeAll();
		}
	},

	addIntegrationPkgToStore: function(store) {
		var integration_package_id = this.getSplitFormIntPkg().getValue();
		if (integration_package_id != store.getExtraParam('integration_package_id')) {
			store.addExtraParams({ integration_package_id: integration_package_id });
		}
	},

	deleteSplitItem: function(grid, rec, rowIndex) {
		grid.getStore().remove(rec);
		// We call refresh to make sure the allocation gets recalculated
		grid.getView().refresh();
	},

	resetSplitForm: function() {
		this.getDefaultSplitForm().getForm().reset();
		this.getSplitFormItemGrid().getStore().rejectChanges();
		this.getSplitFormItemGrid().getStore().sort();
	},

	addSplitLine: function() {
		this.getSplitFormItemGrid().getStore().add(Ext.create('NP.model.system.DfSplitItem'));
	},

	autoAllocSplit: function() {
		function getPropertyUnits(line) {
			var propertyUnits = 0;
			var property_id = line.get('property_id');
			if (property_id !== null) {
				var prop = Ext.getStore('property.AllProperties').findRecord('property_id', property_id, 0, false, false, true);
				propertyUnits = parseFloat(prop.get('property_no_units').replace(/[^0-9.]/g, ''));
				if (isNaN(propertyUnits)) {
					propertyUnits = 0;
				}
			}
			return propertyUnits;
		}

		var grid = this.getSplitFormItemGrid();
		var store = grid.getStore();
		var lines = store.getRange();

		var totalUnits = 0;
		Ext.each(lines, function(line) {
			var propertyUnits = getPropertyUnits(line);
			totalUnits += propertyUnits;
		});

		grid.suspendEvents(false);
		store.suspendEvents(false);
		Ext.each(lines, function(line) {
			if (line.get('property_id') !== null) {
				var propertyUnits = getPropertyUnits(line);
				var percent = (propertyUnits / totalUnits) * 100;
				line.set('dfsplititem_percent', percent);
			}
		});
		grid.resumeEvents();
		store.resumeEvents();
		grid.getView().refresh();
	},

	copySplit: function() {
		var that = this;

		var splitRec = this.getDefaultSplitForm().getModel('system.DfSplit');

		NP.lib.core.Net.remoteCall({
			requests: {
				service	 : 'SplitService',
				action	  : 'copySplit',
				dfsplit_id  : splitRec.get('dfsplit_id'),
				success	 : function(result) {
					NP.Util.showFadingWindow({ html: that.changesSavedText });
					that.addHistory('SystemSetup:showSystemSetup:DefaultSplits:Form:' + result.dfsplit_id);
				}
			}
		});
	},

	deleteSplit: function() {
		var that = this;

		Ext.MessageBox.confirm(this.deleteSplitDialogTitle, this.deleteSplitDialogText, function(btn) {
			// If user clicks Yes, proceed with deleting
			if (btn == 'yes') {
				var dfsplit_id = that.getDefaultSplitForm().getModel('system.DfSplit').get('dfsplit_id');

				that.deleteSplitAction(
					dfsplit_id,
					that.getDefaultSplitForm(),
					{
						success: function() {
							that.addHistory('SystemSetup:showSystemSetup:DefaultSplits');
						}
					}
				);
			}
		});
	},

	saveSplitForm: function() {
		var that = this;
		var form = this.getDefaultSplitForm();

		if (form.isValid()) {
			var modifiedItems = this.getSplitFormItemGrid().getStore().getModifiedRecords();
			var dfSplitItems = [];
			Ext.each(modifiedItems, function(dfSplitItem) {
				dfSplitItems.push(dfSplitItem.getData());
			});

			var removedItems = this.getSplitFormItemGrid().getStore().getRemovedRecords();
			var removedDfSplitItems = [];
			Ext.each(removedItems, function(removedItem) {
				removedDfSplitItems.push(removedItem.get('dfsplititem_id'));
			});

			form.submitWithBindings({
				service: 'SplitService',
				action : 'saveSplit',
				extraParams: {
					dfSplitItems	   : dfSplitItems,
					removedDfSplitItems: removedDfSplitItems
				},
				extraFields: { vendor_id: 'vendor_id' },
				success: function(result) {
					NP.Util.showFadingWindow({ html: that.changesSavedText });
					that.addHistory('SystemSetup:showSystemSetup:DefaultSplits');
				}
			});
		}
	},

	saveWorkflowRoute: function() {
		var me = this,
			form = me.getCmp('systemsetup.workflowrulesroutes').down('[name="routeform"]'),
			originatesGrid = me.getWorkflowOriginatesGrid(),
			values = form.getValues();

		if (form.isValid()) {
			NP.lib.core.Net.remoteCall({
				method  : 'POST',
				requests: {
					service: 'WFRuleService',
					action : 'saveRoute',
					data   : values,
					success: function() {
						originatesGrid.getStore().reload();
						me.getCmp('systemsetup.workflowrulesroutes').clearForm();}
				}
			});
		}
	},

	showLoginPage: function() {
		var me   = this,
			form = me.getCmp('systemsetup.loginpage');

		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'ConfigService',
				action : 'getCustomLogoName',
				success: function(result) {
					form.setLogoFile(result);
				}
			}
		});
	},

	saveClientLogo: function() {
		var me   = this,
			form = me.getCmp('systemsetup.loginpage');
		
		// If form is valid, submit it
		if (form.getForm().isValid()) {
			var formEl = NP.Util.createFormForUpload('[xtype="systemsetup.loginpage"]');

			NP.Net.remoteCall({
				method  : 'POST',
				isUpload: true,
				form    : formEl.id,
				requests: {
					service  : 'ConfigService',
					action   : 'saveClientLogo',
					success : function(result) {
						if (result.success) {
							// Update the image
							form.setLogoFile(result['logo_file']);
							
							// Show friendly message
							NP.Util.showFadingWindow({
								html: NP.Translator.translate('Logo was successfully saved')
							});
						} else {
							if (result.errors.length) {
								form.getForm().findField('logo_file').markInvalid(result.errors[0]);
							}
						}
						Ext.removeNode(formEl);
					},
					failure: function() {
						Ext.log('Error saving client logo');
					}
				}
			});
		}
	},

	saveAndActivateWorkflowRule: function() {
		var me = this,
			form = me.getCmp('systemsetup.workflowrulesbuilder').down('[name="ruleform"]'),
			values = form.getValues();

		if (form.isValid()) {
			NP.lib.core.Net.remoteCall({
				requests: {
					service: 'WFRuleService',
					action: 'saveAndActivateRule',
					userprofile_id: NP.Security.getUser().get('userprofile_id'),
					data: values,
					success: function(result) {
						if (result.activateStatus) {
							me.addHistory('SystemSetup:showSystemSetup:WorkflowRules');
						}
						else {
							me.getCmp('systemsetup.workflowrulesmodify').data.conflictingRules = result.conflictingRules;
							me.getCmp('systemsetup.workflowrulesmodify').stepConflicts();
						}
					}
				}
			});
		}
	},

	removeClientLogo: function() {
		var me        = this,
			form      = me.getCmp('systemsetup.loginpage'),
			container = form.down('container');

		Ext.MessageBox.confirm('Delete Logo?', 'Are you sure you want to delete this logo?', function(btn) {
			// If user clicks Yes, proceed with deleting
			if (btn == 'yes') {
				NP.lib.core.Net.remoteCall({
					method  : 'POST',
					mask    : form,
					requests: {
						service: 'ConfigService',
						action : 'removeClientLogo',
						success: function(result) {
							form.setLogoFile('');
							NP.Util.showFadingWindow({ html: 'Logo was successfully removed' });
						},
						failure: function() {
							Ext.log('Error removing client logo');
						}
					}
				});
			}
		});
	},

	/**
	 * Change tab for the "Settings"
	 *
	 * @param tabPanel
	 * @param tab
	 */
	changeSettingsTab: function(tabPanel, tab) {
		this.filltabContent(tab, this.addField);
	},

	/**
	 * Fill form
	 *
	 * @param tab
	 */
	filltabContent: function(tab, callback) {

		callback = callback || Ext.emptyFn;
		var tabName;

		switch (tab.itemId) {
			case ('general'):
			default :
				tabName =  'General';
				break;
			case ('register'):
				tabName =  'Register';
				break;
			case ('imaging'):
				tabName =  'Imaging';
				break;
			case ('invoice'):
				tabName =  'Invoice';
				break;
			case ('jobcost'):
				tabName =  'Job Cost';
				break;
			case ('purchaseorder'):
				tabName =  'Purchase Order';
				break;
			case ('vendor'):
				tabName =  'Vendor';
				break;
			case ('budget'):
				tabName =  'Budget and GL';
				break;
			case ('intl'):
				tabName =  'Intl';
				break;
		}
		this.settingsActiveTab = tab.itemId;

		var fieldcontainer = tab.down('[name="params"]');
		fieldcontainer.removeAll();
		var mask = new Ext.LoadMask({ target: tab });
		mask.show();
		NP.lib.core.Net.remoteCall({
			requests: {
				service					: 'ConfigService',
				action					: 'getConfigSysValByCat',
				configsyscat_name		: tabName,
				configsysval_show		: 1,
				success: function(success) {
					if (success && success.length > 0) {
						callback(tab, success, fieldcontainer);
						mask.destroy();
					}
				}
			}
		});
	},

	/**
	 * Add fields
	 * @param tab
	 * @param fields
	 * @param fieldcontainer
	 */
	addField: function(tab, fields, fieldcontainer) {
		Ext.suspendLayouts();
		Ext.each(fields, function(field){
			fieldcontainer.add({
				xtype  :'component',
				html   : field.configsys_displayname,
				padding: '5 16 5 8'
			});
			switch (field.configsystype_name) {
				case 'Text':
					fieldcontainer.add({
						xtype: 'textfield',
						name: 'setting_' + field.configsysval_id,
						value: field.configsysval_val,
						width: 250
					});
					break;
				case 'Yes/No':
					fieldcontainer.add({
						xtype: 'shared.yesnofield',
						name: 'setting_' + field.configsysval_id,
						value: field.configsysval_val,
						allowBlank: field.configsys_required
					});
					break;
				case 'Number':
					fieldcontainer.add({
						xtype: 'numberfield',
						name: 'setting_' + field.configsysval_id,
						value: field.configsysval_val,
						decimalPrecision: 0,
						allowBlank: false,
						width: 250
					});
					break;
				case 'Date':
					fieldcontainer.add({
						xtype: 'datefield',
						name: 'setting_' + field.configsysval_id,
						value: field.configsysval_val,
						allowBlank: false
					});
					break;
				case 'Lookup':
					fieldcontainer.add({
						xtype: 'customcombo',
						name: 'setting_' + field.configsysval_id,
						store:Ext.create('NP.store.system.ConfigSysLkpVals', {
							service    	: 'ConfigService',
							action     	: 'getConfigSysLkpVal',
							extraParams: {
								configsyslkp_id: field.configsyslkp_id
							}
						}),
						displayField: 'configsyslkpval_name',
						valueField: 'configsyslkpval_val',
						allowBlank: false,
						editable: false,
						typeAhead:false,
						listeners: {
							afterrender: function(combo, eOpts) {
								combo.getStore().load();
								combo.setValue(field.configsysval_val);
							}
						},
						width: 250
					});
					break;
				case 'LookupMultiple':
					fieldcontainer.add({
						xtype: 'customcombo',
						name: 'setting_' + field.configsysval_id,
						store:Ext.create('NP.store.system.ConfigSysLkpVals', {
							service    	: 'ConfigService',
							action     	: 'getConfigSysLkpVal',
							extraParams: {
								configsyslkp_id: field.configsyslkp_id
							}
						}),
						displayField: 'configsyslkpval_name',
						valueField: 'configsyslkpval_val',
						multiple: true,
						editable: false,
						allowBlank: false,
						typeAhead:false,
						listeners: {
							afterrender: function(combo, eOpts) {
								combo.getStore().load();
								combo.setValue(field.configsysval_val);
							}
						}
					});
					break;
				case 'Table':
					fieldcontainer.add({
						xtype: 'customcombo',
						name: 'setting_' + field.configsysval_id,
						store: Ext.create('NP.lib.data.Store', {
							service    	: 'ConfigService',
							action     	: 'getConfigSysValTable',
							extraParams: {
								tablename: field.configsys_tbl,
								configsys_tbl_name_fld: field.configsys_tbl_name_fld,
								configsys_tbl_val_fld: field.configsys_tbl_val_fld
							},
							fields: ['configsyslkpval_name', 'configsyslkpval_val']
						}),
						displayField: 'configsyslkpval_name',
						valueField: 'configsyslkpval_val',
						allowBlank: false,
						editable: false,
						typeAhead:false,
						listeners: {
							afterrender: function(combo, eOpts) {
								combo.getStore().load();
								combo.setValue(parseInt(field.configsysval_val));
							}
						},
						width: 250
					});
					break;
				case 'Range':
					var range = field.configsys_range.split('-');
					var values = [];
					for (var index = range[0]; index <= range[1]; index++) {
						values.push([index, index]);
					}
					fieldcontainer.add({
						xtype: 'customcombo',
						name: 'setting_' + field.configsysval_id,
						fieldLabel: field.configsys_displayname,
						store: Ext.create('Ext.data.ArrayStore', {
							fields: ['configsyslkpval_val', 'configsyslkpval_name'],
							data: values
						}),
						displayField: 'configsyslkpval_name',
						valueField: 'configsyslkpval_val',
						allowBlank: false,
						editable: false,
						typeAhead:false,
						listeners: {
							afterrender: function(combo, eOpts) {
								combo.getStore().load();
								combo.setValue(field.configsysval_val);
							}
						},
						width: 250
					});
					break;
			}
			fieldcontainer.add({
				xtype: 'hiddenfield',
				name: 'parent_id' + field.configsysval_id,
				value: field.parent_configsysval_id
			});
			fieldcontainer.add({
				xtype: 'hiddenfield',
				name: 'configsys_name_' + field.configsysval_id,
				value: field.configsys_name
			});
		});
		Ext.resumeLayouts(true);
	},

	/**
	 * Save settings
	 */
	saveSettings: function() {
		var form = this.getCmp('systemsetup.settings').down('#' + this.settingsActiveTab).down('[name="params"]'),
			data = form.getValues();

		data = Ext.apply(data, {
			userprofile_id	: NP.Security.getUser().get('userprofile_id')
		});

		if (form.isValid()) {
			NP.lib.core.Net.remoteCall({
				method  : 'POST',
				requests: {
					service: 'ConfigService',
					action : 'saveSettings',
					data   : data,
					success: function(success) {
						if (success.success) {
							NP.Util.showFadingWindow({ html: 'Settings were saved successfully' });
							
							for (var index in data) {
								var configsysval_id = index.split('_')[1],
									configsys_field = form.getForm().findField('configsys_name_' + configsysval_id),
									configsys_name;

								if (configsys_field) {
									configsys_name = configsys_field.getValue();
								
									NP.Config.setSetting(configsys_name, data[index]);
								}
							}
						} else {
							NP.Util.showFadingWindow({ html: success.errors });
						}
					}
				}
			});
		}
	},

	activateWorkflowRule: function(ruleid) {
		var me = this;

		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'WFRuleService',
				action: 'activateRule',
				ruleid: ruleid,
				success: function(result) {
					if (result.activateStatus) {
						me.addHistory('SystemSetup:showSystemSetup:WorkflowRules');
					}
					else {
						me.getCmp('systemsetup.workflowrulesmodify').data.conflictingRules = result.conflictingRules;
						me.getCmp('systemsetup.workflowrulesmodify').stepConflicts();
					}
				}
			}
		});
	},

	/**
	 * Show edit form for the custom field
	 * @param dataview
	 * @param record
	 * @param lineitem
	 */
	showFieldEditForm: function(dataview, record, lineitem) {
		var me = this,
			panel = dataview.up().up(),
			tabindex = panel.name == 'headers' ? 0 : (panel.name == 'lineitems' ? 1 : (panel.name == 'servicefields' ? 2 : 3)),
			fid = tabindex < 2 ? parseInt(record.get('controlpanelitem_name')[record.get('controlpanelitem_name').length - (!lineitem ? 1 : 10)]) : parseInt(record.get('customfield_id')),
			headerform = me.getCmp('systemsetup.customfieldform', {tabindex: tabindex, fid: fid});

		if (!headerform) {
			panel.add({
				xtype: 'systemsetup.customfieldform',
				flex: 1,
				tabindex: tabindex,
				fid: fid
			});
			headerform = me.getCmp('systemsetup.customfieldform');
		}

		NP.lib.core.Net.remoteCall({
			requests: {
				service    : 'ConfigService',
				action     : 'getHeaderValues',
				fid: fid,
				tabindex: tabindex,
				success    : function(result) {
					if (result) {
						Ext.suspendLayouts();

						var fieldTypeFn = (tabindex != 0 || fid > 2) ? 'hide' : 'show';
						headerform.down('[name="customFieldTypeGroup"]')[fieldTypeFn]();

						if (tabindex < 2) {
							headerform.setTitle('Custom Field ' + fid);
							headerform.getForm().findField('customfielddata').setFieldLabel((tabindex < 2 ? 'Custom Field ' : 'Field ') + fid + ' Values');
						} else {
							headerform.setTitle('Custom Field ' + record.get('controlpanelitem_name')[record.get('controlpanelitem_name').length - 1]);
							headerform.getForm().findField('customfielddata').setFieldLabel((tabindex < 2 ? 'Custom Field ' : 'Field ') + record.get('controlpanelitem_name')[record.get('controlpanelitem_name').length - 1] + ' Values');
						}
						headerform.getForm().findField('customfielddata').getStore().getProxy().extraParams.fid = fid;
						if (tabindex >= 2) {
							headerform.getForm().findField('customfielddata').getStore().getProxy().extraParams.pntype = result.customfield_pn_type;
							headerform.getForm().findField('customfielddata').getStore().getProxy().extraParams.universal_field_id = result.universal_field_number;
						}
						headerform.getForm().findField('customfielddata').getStore().load();
						headerform.down('[name="dataandselectfield"]').hide();

						if (tabindex >= 2) {
							headerform.down('[name="dataandselectfield"]').show();
							headerform.getForm().findField('custom_field_maxlength').show();
						} else {
							if (fid !== 7 && fid !== 8) {
								headerform.getForm().findField('custom_field_maxlength').hide();
								headerform.down('[name="dataandselectfield"]').show();
							} else {
								headerform.getForm().findField('custom_field_maxlength').show();
								headerform.down('[name="dataandselectfield"]').hide();
							}
						}
						if (tabindex !== 1 || fid !== 1) {
							headerform.down('[name="glaccountBtn"]').hide();
						} else {
							headerform.down('[name="glaccountBtn"]').show();
						}

						headerform.getForm().findField('universal_field_number').setValue(!result['universal_field_number'] ? '' : result['universal_field_number']);
						headerform.getForm().findField('fid').setValue(parseInt(fid));
						headerform.getForm().findField('invoice_custom_field_on_off').setValue(parseInt(result['inv_custom_field_on_off']));
						headerform.getForm().findField('invoice_custom_field_req').setValue(parseInt(result['inv_custom_field_req']));
						headerform.getForm().findField('po_custom_field_on_off').setValue(parseInt(result['po_custom_field_on_off']));
						headerform.getForm().findField('po_custom_field_req').setValue(parseInt(result['po_custom_field_req']));
						headerform.getForm().findField('vef_custom_field_on_off').setValue(parseInt(result['vef_custom_field_on_off']));
						headerform.getForm().findField('vef_custom_field_req').setValue(parseInt(result['vef_custom_field_req']));
						if (tabindex == 0) {
							headerform.getForm().findField('inv_custom_field_imgindex').setValue(parseInt(parseInt(result['inv_custom_field_imgindex'])));
							headerform.getForm().findField('customFieldType').setValue(result['customFieldType'] == 'select' ? 0 : 1);

						}
						if (tabindex > 1) {
							headerform.getForm().findField('customFieldType').setValue(result['customfield_type'] == 'select' ? 0 : (result['customfield_type'] == '' || result['customfield_type'] == 'text' ? 3 : 2));
							headerform.getForm().findField('custom_field_lbl').setValue(result['customfield_label']);
							headerform.getForm().findField('customfield_status').setValue(result['po_on_off']);
							headerform.getForm().findField('customfield_req').setValue(result['po_req']);
						} else {
							headerform.getForm().findField('custom_field_lbl').setValue(result['custom_field_lbl']);
						}

						headerform.getForm().findField('custom_field_maxlength').setValue(tabindex < 2 ? parseInt(!result['maxlength'] ? 0 : result['maxlength']) : parseInt(!result['customfield_max_length'] ? 0 : result['customfield_max_length']));

						headerform.show();

						Ext.resumeLayouts(true);
					}
				}
			}
		});
	},

	/**
	 * Save custom fields values
	 */
	saveCustomField: function() {
		var form = this.getCmp('systemsetup.customfieldform'),
			values = form.getValues(),
			data = {},
			me = this,
			grid = form.up().down('customgrid');

		data['universal_field_number'] = parseInt(values['universal_field_number']);
		data['fid'] = parseInt(values['fid']);
		data['islineitem'] = form.tabindex;
		data['custom_field_maxlength'] = values['custom_field_maxlength'];

		if (form.tabindex < 2) {
			data['field_inv_on_off'] = values['invoice_custom_field_on_off'];
			data['field_inv_req']    = values['invoice_custom_field_req'];
			data['field_po_on_off']  = values['po_custom_field_on_off'];
			data['field_po_req']     = values['po_custom_field_req'];
			data['field_imgindex']   = values['inv_custom_field_imgindex'];
			data['field_lbl']        = values['custom_field_lbl'];
			if ('customFieldType' in values) {
				data['customfield_type'] = (values['customFieldType'] == 0) ? 'select' : 'date';
			} else {
				data['customfield_type'] = 'select';
			}
		} else {
			data['custom_field_lbl']         = values['custom_field_lbl'];
			data['customfield_req']          = values['customfield_req'];
			data['customfield_status']       = values['customfield_status'];
			data['customfield_type']         = values['customFieldType'] == 0 ? 'select' : (values['customFieldType'] == 2 ? 'date' : 'text');
			data['customfield_lastupdateby'] = NP.Security.getUser().get('userprofile_id');
		}

		NP.lib.core.Net.remoteCall({
			requests: {
				service    : 'ConfigService',
				action     : 'updateCustomField',
				data: data,
				success    : function(result) {
					if (result) {
						// If successful, also update our cached variable if applicable
						if (form.tabindex < 2) {
							var key          = (data['islineitem']) ? 'line' : 'header',
								customFields = NP.Config.getCustomFields(),
								num          = data['universal_field_number'];
							
							customFields[key].fields[num].invOn = (data['field_inv_on_off']) ? true : false;
							customFields[key].fields[num].invRequired = (data['field_inv_req']) ? true : false;
							customFields[key].fields[num].poOn = (data['field_po_on_off']) ? true : false;
							customFields[key].fields[num].poRequired = (data['field_po_req']) ? true : false;
							customFields[key].fields[num].label = data['field_lbl'];
							customFields[key].fields[num].type = data['customfield_type'];
						}

						NP.Util.showFadingWindow({ html: 'Item was updated successfully!' });
						form.up().remove(form);
						grid.getStore().reload();
					}
				}
			}
		});
	},

	saveWorkflowRule: function() {
		var me = this,
			form = me.getCmp('systemsetup.workflowrulesbuilder').down('[name="ruleform"]'),
			values = form.getValues();

		if (Ext.get('email_suppression_hours')) {
			values.email_suppression_hours = Ext.get('email_suppression_hours').dom.value;
		}

		if (form.isValid()) {
			NP.lib.core.Net.remoteCall({
				method  : 'POST',
				requests: {
					service: 'WFRuleService',
					action: 'saveRule',
					userprofile_id: NP.Security.getUser().get('userprofile_id'),
					data: values,
					success: function(result) {
						me.getCmp('systemsetup.workflowrulesmodify').data = result.ruledata;
						me.getCmp('systemsetup.workflowrulesmodify').stepRoutes();
					}
				}
			});
		}
	},

	decisionRuleConflict: function() {
		var me = this,
			form = me.getCmp('systemsetup.workflowrulesconflicts').down('[name="nextactionform"]'),
			values = form.getValues(),
			ruledata = me.getCmp('systemsetup.workflowrulesmodify').data;

		if (values.nextaction == 'edit') {
			me.getCmp('systemsetup.workflowrulesmodify').stepRules();
		}
		else {
			var rulesIdList = [];

			for (var i in ruledata.conflictingRules) {
				rulesIdList.push(ruledata.conflictingRules[i].wfrule_id);
			}

			NP.lib.core.Net.remoteCall({
				requests: {
					service: 'WFRuleService',
					action : 'deleteRules',
					ruleIdList: rulesIdList.join(),
					success: function() {
						me.activateWorkflowRule(ruledata.rule.wfrule_id);
						me.addHistory('SystemSetup:showSystemSetup:WorkflowRules');
					}
				}
			});
		}
	},

	/**
	 * Change custom fields tab
	 *
	 * @param tab
	 */
	changeCustomFieldsTab: function(tab) {
		var me   = this,
			form = me.getCmp('systemsetup.customfieldform');
		if (form) {
			tab.remove(form);
		}
		form = null;
	},

	/**
	 * Load picklist columns
	 *
	 * @param grid
	 * @param record
	 */
	loadPicklistColumns: function (tabPanel, tab) {
		var me = this,
			columnsgrid = tab.down('[name="picklistcolumns"]');

		columnsgrid.getStore().getProxy().extraParams.mode = tab.mode;
		columnsgrid.getStore().reload();
		me.resetPickListForm(false, tab);
	},

	/**
	 * Load picklist form
	 *
	 * @param grid
	 * @param record
	 */
	loadPicklistForm: function(grid, record) {
		var me = this,
			picklistview = grid.up().up(),
			picklistform = picklistview.down('[name="picklistfields"]'),
			recordvalue = {
				column_status: record.get('column_status'),
				column_pk_data: record.get('column_pk_data')
			};

		me.fillFormPicklist(recordvalue, picklistform, picklistview.mode);
	},

	fillFormPicklist: function(record, form, mode) {
		var me = this;

		NP.lib.core.Net.remoteCall({
			requests: {
				service    : 'PicklistService',
				action     : 'getFormFields',
				mode:mode,
				column_status: record.column_status,
				column_id: record.column_pk_data,
				success    : function(result) {
					if (result) {
						var values = result['values'];
						form.removeAll();
						Ext.suspendLayouts();
						Ext.each(result['fields'], function(column){
							form.add(me.fillPicklistForm(column, values[0]));
						});
						form.add({
							xtype: 'hiddenfield',
							name: 'column_id',
							value: record.column_pk_data
						});
						Ext.resumeLayouts(true);
					}
				}
			}
		});
	},

	/**
	 * Add form's fields
	 *
	 * @param column
	 * @param values
	 * @returns {*}
	 */
	fillPicklistForm: function(column, values) {
		var field;
		
		if (column.dropdown_flag == 1) {
			field = {
				xtype: 'customcombo',
				name: column.column_name,
				allowBlank: column.column_info[0].NULLABLE,
				addBlankRecord: column.column_info[0].NULLABLE,
				displayField: 'dropdown_display_text',
				valueField: 'dropdown_value',
				fieldLabel: column.column_name_title,
				store: Ext.create('NP.lib.data.Store', {
					service    	: 'PicklistService',
					action     	: 'prepareDropdownValues',
					extraParams: {
						column_id: column.picklist_column_id,
						dropdown_flag: 1
					},
//					autoLoad	: true,
					fields: ['dropdown_value', 'dropdown_display_text']
				}),
				listeners: {
					afterrender: function(combo, eOpts) {
						combo.getStore().load();
						combo.setValue(!values ? '' : values[column.column_name]);
					}
				}
			};
		} else {
			if (column.dropdown_flag == 2) {
				field = {
					xtype: 'customcombo',
					name: column.column_name,
					allowBlank: column.column_info[0].NULLABLE,
					addBlankRecord: column.column_info[0].NULLABLE,
					displayField: 'dropdown_display_text',
					valueField: 'dropdown_value',
					fieldLabel: column.column_name_title,
					store: Ext.create('NP.lib.data.Store', {
						service    	: 'PicklistService',
						action     	: 'prepareDropdownValues',
						extraParams: {
							column_id: column.picklist_column_id,
							dropdown_flag: 2
						},
						autoLoad	: false,
						fields: ['dropdown_value', 'dropdown_display_text']
					}),
					listeners: {
						afterrender: function(combo, eOpts) {
							combo.getStore().load();
							combo.setValue(!values ? '' : values[column.column_name]);
						}
					}
				};
			} else {
				if (column.column_name == 'universal_field_status') {
					field = {
						xtype: 'radiogroup',
						name: 'universal_field_status',
						fieldLabel: 'Status',
						layout: 'hbox',
						columns: 1,
						items: [
							{
								boxLabel: NP.Translator.translate('Active'), name: 'universal_field_status', inputValue: '1', checked: !values ? true : (values[column.column_name] == 1 ? true : false), padding: '0 15 0 0'
							},
							{
								boxLabel: NP.Translator.translate('Inactive'), name: 'universal_field_status', inputValue: '0', padding: '0 15 0 0', checked: !values ? false : (values[column.column_name] == 0 ? true : false)
							},
							{
								boxLabel: NP.Translator.translate('Default'), name: 'universal_field_status', inputValue: '2', padding: '0 15 0 0', checked: !values ? false : (values[column.column_name] == 2 ? true : false)
							}
						]
					};
				} else {
					if (column.column_info[0].TYPE_NAME == 'varchar' ||
						column.column_info[0].TYPE_NAME == 'char' ||
						column.column_info[0].TYPE_NAME == 'StringStatus' ||
						column.column_info[0].TYPE_NAME == 'StringSubject' ||
						column.column_info[0].TYPE_NAME == 'StringDescription'
						) {
						field = {
							xtype: 'textfield',
							name: column.column_name,
							fieldLabel: column.column_name_title,
							disabled: column.column_name.length > 0 && column.readonly,
							allowBlank: column.column_info[0].NULLABLE,
							value: !values ? '' : values[column.column_name]
						};
					}
					if (column.column_info[0].TYPE_NAME == 'int' && column.column_name !== 'universal_field_status') {
						field = {
							xtype: 'numberfield',
							name: column.column_name,
							fieldLabel: column.column_name_title,
							disabled: column.column_name.length > 0 && column.readonly,
							allowBlank: column.column_info[0].NULLABLE,
							decimalPrecision: 0,
							value: !values ? '' : values[column.column_name]
						};
					}

					if (column.column_info[0].TYPE_NAME == 'bigint' ||
						column.column_info[0].TYPE_NAME == 'real' ||
						column.column_info[0].TYPE_NAME == 'money' ||
						column.column_info[0].TYPE_NAME == 'decimal' ||
						column.column_info[0].TYPE_NAME == 'float'
						) {
						field = {
							xtype: 'numberfield',
							name: column.column_name,
							fieldLabel: column.column_name_title,
							disabled: column.column_name.length > 0 && column.readonly,
							allowBlank: column.column_info[0].NULLABLE,
							decimalPrecision: column.column_info[0].TYPE_NAME == 'bigint' ? 0 : 2,
							value: !values ? '' : values[column.column_name]
						};
					}

					if (column.column_info[0].TYPE_NAME == 'bit' ||
						column.column_info[0].TYPE_NAME == 'Boolean') {

						field = {
							xtype: 'shared.yesnofield',
							name: column.column_name,
							fieldLabel: column.column_name_title,
							disabled: column.column_name.length > 0 && column.readonly,
							value: !values ? '' : values[column.column_name]
						};
					}

					if (column.column_info[0].TYPE_NAME == 'datetime') {
						field = {
							xtype: 'datefield',
							name: column.column_name,
							fieldLabel: column.column_name_title,
							disabled: column.column_name.length > 0 && column.readonly,
							value: !values ? '' : values[column.column_name]
						};
					}

					if (column.column_info[0].TYPE_NAME == 'text') {
						field = {
							xtype: 'textareafield',
							name: column.column_name,
							fieldLabel: column.column_name_title,
							disabled: column.column_name.length > 0 && column.readonly,
							value: !values ? '' : values[column.column_name]
						};
					}
				}

			}

		}

		return field;
	},

	/**
	 * Save picklist field values
	 *
	 */
	savePicklist: function(button) {
		var me = this;
		if (button) {
			var picklistform = button.up().up(),
			picklistview = picklistform.up(),
			data = picklistform.getValues();

			Ext.apply(data, {
				mode: picklistview.mode
			});

			if (picklistform.isValid()) {
				NP.lib.core.Net.remoteCall({
					requests: {
						service    : 'PicklistService',
						action     : 'savePicklist',
						data: data,
						success    : function(result) {
							if (result) {
								me.fillFormPicklist({
									column_pk_data: 0,
									column_status: 1
								}, picklistform, picklistview.mode)
								picklistview.down('[name="picklistcolumns"]').getStore().reload();
							}
						}
					}
				});
			}
		}
	},

	resetPickListForm: function(button, tab) {
		var me = this,
			picklistform = !button ? tab.down('[name="picklistfields"]') : button.up().up(),
			picklistview = picklistform.up(),
			recordvalue = {
				column_status: 1,
				column_pk_data: 0
			};

		me.fillFormPicklist(recordvalue, picklistform, picklistview.mode);
	},

	showTemplatesGrid: function() {
		this.setView('NP.view.systemSetup.TemplatesGrid', {}, '[xtype="systemsetup.poprintsettings"]');
	},

	showPrintTemplate: function(id, copy) {
		var me = this,
			viewConfig = {
				bind: {
					models: [
						'system.PrintTemplate'
					]
				}
			},
			templateObj,
			assignedObjects = [],
			assignedTemplates = {},
			regions = [
				'template_body',
				'template_footer',
				'template_footer_left',
				'template_footer_right',
				'template_header',
				'template_header_left',
				'template_header_right',
				'template_logo_center',
				'template_logo_left',
				'template_logo_right'
			],
			id = parseInt(id) ? parseInt(id) : 0;

		if (id) {
			Ext.apply(viewConfig.bind, {
				service    : 'PrintTemplateService',
				action     : 'get',
				extraParams: {
					id: id
				},
				extraFieds: ['properties']
			});

			viewConfig.listeners = {
				dataloaded: function(boundForm, data) {
					Ext.suspendLayouts();

					templateObj = JSON.parse(data.Print_Template_Data),
						templatesPicker = boundForm.down('[name="templatespicker"]'),
						templatetab = boundForm.down('[name="templatetab"]'),
						templatesCanvas = null;

//					header, footer, additional text
					boundForm.getForm().findField('poprint_additional_text').setValue(templateObj.template_additional_text);
					boundForm.getForm().findField('poprint_footer').setValue(templateObj.template_footer_text);
					boundForm.getForm().findField('poprint_header').setValue(templateObj.template_header_text);

//					settings
					if (templateObj.settings) {
						boundForm.getForm().findField('po_include_attachments').setValue(templateObj.settings.po_include_attachments);
						boundForm.getForm().findField('po_lineitems_display_opts_buildingcode').setValue(templateObj.settings.po_lineitems_display_opts_buildingcode);
						boundForm.getForm().findField('po_lineitems_display_opts_customfields').setValue(templateObj.settings.po_lineitems_display_opts_customfields);
						boundForm.getForm().findField('po_lineitems_display_opts_glcode').setValue(templateObj.settings.po_lineitems_display_opts_glcode);
						boundForm.getForm().findField('po_lineitems_display_opts_itemnum').setValue(templateObj.settings.po_lineitems_display_opts_itemnum);
						boundForm.getForm().findField('po_lineitems_display_opts_jobcost').setValue(templateObj.settings.po_lineitems_display_opts_jobcost);
						boundForm.getForm().findField('po_lineitems_display_opts_uom').setValue(templateObj.settings.po_lineitems_display_opts_uom);
					}


//					unassigned objects
					Ext.each(regions, function(region) {
						if (templateObj[region].length > 0) {
							Ext.each(templateObj[region], function(item) {
								assignedObjects.push(item);
							})
						}
					});

					assignedTemplates = templatesPicker.listDiff(assignedObjects);

					Ext.each(regions, function(region){
						if (templateObj[region].length > 0) {
							templatesCanvas = boundForm.down('[name="' + region + '"]');
							Ext.each(templateObj[region], function(item) {
								if (assignedTemplates[item]) {
									templatesCanvas.addTile(assignedTemplates[item][0], assignedTemplates[item][2], assignedTemplates[item][1]);
									templatetab.addTemplate(region, assignedTemplates[item][1]);
								}
							});
						}
					});

					if (data.properties && data.properties.length > 0) {
						if (data.properties[0] == -1) {
							boundForm.getForm().findField('property_type').setValue(1);
							boundForm.getForm().findField('property_id').hide();
						} else {
							boundForm.getForm().findField('property_type').setValue(0);
							boundForm.getForm().findField('property_id').setValue(data.properties);
						}
					}

					me.getCmp('systemsetup.printtemplatetab').setTitle(data.Print_Template_Name);
					me.getCmp('systemsetup.printheadertab').setTitle(data.Print_Template_Name);
					me.getCmp('systemsetup.printfootertab').setTitle(data.Print_Template_Name);
					me.getCmp('systemsetup.printsettingstab').setTitle(data.Print_Template_Name);
					me.getCmp('systemsetup.printadditionaltexttab').setTitle(data.Print_Template_Name);

					boundForm.getForm().findField('poprint_customfields').setValue(NP.Config.getSetting('PN.POOptions.POPrintCustomFields'));

					if (copy) {
						boundForm.getForm().findField('Print_Template_Id').setValue('');
						boundForm.getForm().findField('Print_Template_Name').setValue(data.Print_Template_Name + ' (copy)');
						boundForm.getForm().findField('print_template_additional_image').setValue(0);
						boundForm.getForm().findField('template_attachment').setValue(0);
					} else {
						if (templateObj.template_settings && templateObj.template_settings.print_template_additional_image) {
							boundForm.getForm().findField('print_template_additional_image').setValue(1);
						}
						if (templateObj.template_attachment) {
							boundForm.getForm().findField('template_attachment').setValue(1);
						}

					}

					Ext.resumeLayouts(true);
				}
			};
		}
		Ext.apply(viewConfig, {
			templateid: id
		});

		var form = this.setView('NP.view.systemSetup.TemplatesManager', viewConfig, '[xtype="systemsetup.poprintsettings"]');

		// We need to jump through hoops to set the proper borders on the title
		function setBorders() {
			var header = me.getCmp('systemsetup.printtemplatetab').getHeader();
			
			if (header) {
				Ext.suspendLayouts();

				header.setBorder('0 0 1 0');
				header.getEl().removeCls('x-docked-top');
				header.getEl().setStyle({
					'border-bottom-width' : '1px'
				});

				Ext.resumeLayouts(true);
			} else {
				Ext.defer(setBorders, 200);
			}
		}
		setBorders();
	},

	addTemplateItem: function(index, name) {
		var me = this,
			templatesPicker = me.getCmp('systemsetup.templateobjectspicker'),
			templateTab = me.getCmp('systemsetup.printtemplatetab'),
			record = templatesPicker.getRecordByndex(index),
			templates = templateTab.addTemplate(name, record[1]);

		templatesPicker.removeRecord(index);

	},

	removeTemplateItem: function(index, name, record) {
		var me = this,
			templatesPicker = me.getCmp('systemsetup.templateobjectspicker'),
			templatesTab = me.getCmp('systemsetup.printtemplatetab'),
			templates = templatesTab.removeTemplate(name, record[1]);

		templatesPicker.addRecord(index, record);
	},

	savePrintTemplate: function() {
		var me = this,
			form = me.getCmp('systemsetup.templatesmanager'),
			templateobj = form.down('[name="templatetab"]').positions;

		templateobj.template_footer_text = form.findField('poprint_footer').getValue();
		templateobj.template_header_text = form.findField('poprint_header').getValue();
		templateobj.template_additional_text = form.findField('poprint_additional_text').getValue();
		templateobj.settings = {
			po_lineitems_display_opts_itemnum: form.findField('po_lineitems_display_opts_itemnum').getValue(),
			po_lineitems_display_opts_uom: form.findField('po_lineitems_display_opts_uom').getValue(),
			po_lineitems_display_opts_glcode: form.findField('po_lineitems_display_opts_glcode').getValue(),
			po_lineitems_display_opts_buildingcode: form.findField('po_lineitems_display_opts_buildingcode').getValue(),
			po_lineitems_display_opts_jobcost: form.findField('po_lineitems_display_opts_jobcost').getValue(),
			po_lineitems_display_opts_customfields: form.findField('po_lineitems_display_opts_customfields').getValue(),
			po_include_attachments: form.findField('po_include_attachments').getValue()
		};

		templateobj.template_attachment = form.findField('template_attachment').getValue();
		templateobj.template_settings = {};
		templateobj.template_settings.print_template_additional_image = form.findField('print_template_additional_image').getValue();
		poprint_customfields = form.findField('poprint_customfields').getValue();

		if (form.isValid()) {
			form.submitWithBindings({
				service: 'PrintTemplateService',
				action: 'saveTemplates',
				extraParams: {
					templateobj: JSON.stringify(form.down('[name="templatetab"]').positions),
					userprofile_id: NP.Security.getUser().get('userprofile_id'),
					properties: form.findField('property_id').getValue(),
					property_type: form.findField('property_type').getValue(),
					poprint_customfields: poprint_customfields
				},
				success: function(result) {
					if (result.success) {
						NP.Config.setSetting('PN.POOptions.POPrintCustomFields', poprint_customfields);
						me.addHistory('SystemSetup:showSystemSetup:POPrintSettings');
					}
				}
			});
		}
	},

	showTemplatePropertyAssignmentWindow: function(id) {
		var me = this,
			window,
			list = '<ul>';
		NP.lib.core.Net.remoteCall({
			requests: {
				service    : 'PrintTemplateService',
				action     : 'getAssignedProperties',
				id: id,
				success    : function(result) {
					window = Ext.create('NP.view.systemSetup.PropertyAssignmentsWindow');

					if (result.length == 0) {
						list += '<li>' + NP.Translator.translate('No Assignments') + '</li>';
					} else {
						if (result.length == 1 && result[0]['Property_Id'] == -1) {

							list += '<li>' + NP.Translator.translate('All Properties') + '</li>';
						} else {
							Ext.each(result, function(property) {
								list += '<li>' +property.property_name + '</li>';
							})
						}
					}
					window.down('[name="propertyassignments"]').setValue(
						list + '</ul>'
					);
					window.show();
				}
			}
		});
	},

	deletePrintTemplate: function(id) {
		var me = this,
			deleteTemplate     = NP.Translator.translate('Delete template?'),
			deleteTemplateText = NP.Translator.translate('Are you sure you want to delete this print template?');

		Ext.MessageBox.confirm(deleteTemplate, deleteTemplateText, function(btn) {
			// If user clicks Yes, proceed with deleting
			if (btn == 'yes') {
				NP.lib.core.Net.remoteCall({
					requests: {
						service: 'PrintTemplateService',
						action : 'deleteTemplate',
						id     : id,
						success: function(result) {
							if (result) {
								NP.Util.showFadingWindow({ html: NP.Translator.translate('Template was delete successfully!') });
								me.addHistory('SystemSetup:showSystemSetup:POPrintSettings');
							}
						}
					}
				});
			}
		});
	},

	changepotabs: function(tabpanel, tab) {
		var isWithAttachment,
			isWithImage,
			me = this;

		Ext.suspendLayouts();

		if (tab.name !== 'templatetab' && tabpanel.up().templateid == 0) {
			me.addHistory('SystemSetup:showSystemSetup:POPrintSettings');
		}

		tabpanel.up().down('[name="uploadattachment"]').hide();
		tabpanel.up().down('[name="viewAttachmentBtn"]').hide();
		tabpanel.up().down('[name="deleteAttachmentBtn"]').hide();

		tabpanel.up().down('[name="uploadimage"]').hide();
		tabpanel.up().down('[name="viewImageBtn"]').hide();
		tabpanel.up().down('[name="deleteImageBtn"]').hide();

		if (tab.name == 'additionaltexttab') {
			isWithAttachment = tab.down('[name="template_attachment"]').getValue();

			tabpanel.up().down('[name="uploadattachment"]').show();
			
			if (isWithAttachment == 1) {
				tabpanel.up().down('[name="viewAttachmentBtn"]').show();
				tabpanel.up().down('[name="deleteAttachmentBtn"]').show();
			}

			tab.getLayout().setActiveItem(0);
		} else if (tab.name == 'settings') {
			isWithImage = tab.down('[name="print_template_additional_image"]').getValue();

			tabpanel.up().down('[name="uploadimage"]').show();

			if (isWithImage == 1) {
				tabpanel.up().down('[name="viewImageBtn"]').show();
				tabpanel.up().down('[name="deleteImageBtn"]').show();
			}

			tab.getLayout().setActiveItem(0);
		}

		Ext.resumeLayouts(true);
	},

	showUploadAttachment: function(id) {
		var me = this,
			tab = me.getCmp('systemsetup.printadditionaltexttab'),
			toptab = tab.up().up(),
			isWithAttachment = tab.down('[name="template_attachment"]').getValue();

		tab.down('[name="uploadattachment"]').show();

		tab.getLayout().setActiveItem(1);
	},

	showUploadImage: function(id) {
		var me = this,
			tab = me.getCmp('systemsetup.printsettingstab'),
			toptab = tab.up().up();

		tab.down('[name="uploadimage"]').show();

		tab.getLayout().setActiveItem(1);
	},

	showPicklists: function() {
		var me = this,
			tab = me.getCmp('systemsetup.picklists').down('[name="insurance"]');

		me.resetPickListForm(false, tab);
	}
});