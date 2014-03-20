/**
 * Created by Andrey Baranov
 * date: 2/28/14 1:27 PM
 */
Ext.define('NP.controller.Integration', {
	extend: 'NP.lib.core.AbstractController',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security',
		'NP.lib.core.Net',
		'NP.lib.core.Translator',
		'NP.lib.core.Util'
	],

	views: [
		'NP.view.integration.Main',
		'NP.view.integration.Overview',
		'NP.view.integration.OnDemandSync',
		'NP.view.integration.FailedSynchDetailsWindow',
		'NP.view.integration.Report',
		'NP.view.integration.Settings'
	],

	stores: [
		'integration.PnSchedules'
	],

	models: [
		'integration.PnSchedule'
	],

	refs: [
		{ ref: 'settingsForm', selector: '[xtype="integration.settings"]' }
	],

	init: function() {
		var me  = this,
			app = me.application;

		me.control({
			'[xtype="integration.main"]': {
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					var activeTab = Ext.getClassName(newCard).split('.').pop();
					me.addHistory('Integration:showIntegration:' + activeTab);
				}
			},
			'[xtype="integration.settings"] [name="integration_package_id"]': {
				select: function(combo, recs) {
					me.loadSettings(recs[0].get('integration_package_id'));
				}
			},
			'[xtype="integration.settings"] [xtype="shared.button.save"]': {
				click: me.saveSettings
			},
			'[xtype="integration.ondemandsync"] [xtype="shared.button.cancel"]': {
				click: function() {
					me.addHistory('Integration:showIntegration:Overview')
				}
			},
			'[xtype="integration.overview"] [xtype="integration.synchhistorygrid"]': {
				cellclick: function(gridView, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					if (cellIndex == 6 && record.get('Details') == 'error') {
						me.showFailedSynchDetails(record.raw['history_id']);
					}
				}
			},
			'[xtype="integration.ondemandsync"] [xtype="shared.button.next"]': {
				click: me.requestTransfer
			}
		});
	},

	/**
	 * Show integration tabs ("Overview" as default)
	 *
	 * @param activeTab
	 */
	showIntegration: function(activeTab) {
		var me = this,
			showMethod = 'show' + activeTab,
			tabPanel = me.setView('NP.view.integration.Main');

		// If no active tab is passed, default to Open
		if (!activeTab) {
			activeTab = 'Overview';
		}

		// Check if the tab to be selected is already active, if it isn't make it the active tab
		var tab = me.getCmp('integration.' + activeTab.toLowerCase());

		// Set the active tab if it hasn't been set yet
		if (tab.getXType() != tabPanel.getActiveTab().getXType()) {
			tabPanel.suspendEvents(false);
			tabPanel.setActiveTab(tab);
			tabPanel.resumeEvents();
		}

		if (me[showMethod]) {
			me[showMethod]();
		}
	},

	showSettings: function() {
		var me    = this,
			form  = me.getSettingsForm().getForm(),
			integration_package_id = form.findField('integration_package_id').getValue();
		
		me.loadSettings(integration_package_id);
	},

	/**
	 * Load settings
	 *
	 */
	loadSettings: function(integration_package_id) {
		var me     = this,
			intPkg = Ext.getStore('system.IntegrationPackages').getById(integration_package_id),
			fields = me.getSettingsForm().getForm().getFields();

		fields.each(function(field) {
			var fieldName = field.getName();
			if (fieldName !== 'integration_package_id' && (fieldName in intPkg.getData())) {
				field.setValue(intPkg.get(fieldName));
			}
		});
	},

	/**
	 * Save settings
	 *
	 */
	saveSettings: function() {
		var me       = this,
			form     = me.getSettingsForm(),
			settings = form.getValues(),
			rec      = Ext.getStore('system.IntegrationPackages').getById(settings.integration_package_id);

		settings = Ext.apply(rec.getData(), settings);
		settingDefaults = {
			custom_field7_maxlength         : 50,
			custom_field8_maxlength         : 50,
			custom_field7_lineitem_maxlength: 50,
			custom_field8_lineitem_maxlength: 50
		};

		for (var field in settingDefaults) {
			if (settings[field] === null) {
				settings[field] = settingDefaults[field];
			}
		}

		if (form.isValid()) {
			NP.lib.core.Net.remoteCall({
				method  : 'POST',
				mask    : form,
				requests: {
					service		: 'IntegrationService',
					action		: 'saveSettings',
					settings	: settings,
					success		: function(result) {
						if (result) {
							var rec = Ext.getStore('system.IntegrationPackages').getById(settings.integration_package_id);
							rec.set(settings);
							NP.Util.showFadingWindow({ html: NP.Translator.translate('Settings were saved successfully!') });
						}
					}
				}
			});
		}
	},

	/**
	 * show failed sync details
	 *
	 * @param history_id
	 */
	showFailedSynchDetails: function(history_id) {
		var me = this;

		NP.lib.core.Net.remoteCall({
			requests: {
				service		: 'IntegrationService',
				action		: 'getByHistoryId',
				history_id	: history_id,
				success		: function(result) {
					if (result) {
						var window = Ext.create('NP.view.integration.FailedSynchDetailsWindow', {
							title: result[0].schedulename,
							transferred_datetm: result[0].transferred_datetm,
							history_id: history_id
						});
						window.show();
					}
				}
			}
		});

	},

	requestTransfer: function() {
		var me = this,
			tab = me.getCmp('integration.ondemandsync'),
			chboxes = tab.down('[name="taskstorun"]'),
			schedules = [];

		Ext.each(chboxes.getChecked(), function(schedule) {
			schedules.push(schedule.inputValue);
		});

		if (schedules.length > 0) {
			NP.lib.core.Net.remoteCall({
				method  : 'POST',
				mask    : chboxes,
				requests: {
					service               : 'IntegrationService',
					action                : 'importOnDemandIntegration',
					userprofile_id: NP.Security.getUser().get('userprofile_id'),
					schedules   : schedules,
					success: function(result) {
						chboxes.reset();
						NP.Util.showFadingWindow({ html: NP.Translator.translate('Import was completed successfully') });
					},
					failure: function(response, options){
						Ext.MessageBox.alert(NP.Translator.translate('Error'), NP.Translator.translate('Cannot import tasks'));
					}
				}
			});
		}
	}

});