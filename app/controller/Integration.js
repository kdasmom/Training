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
		'NP.view.integration.FailedSynchDetailsWindow'
	],

	init: function() {
		var me  = this,
			app = me.application;

		// Setup event handlers
		me.control({
			'[xtype="integration.main"]': {
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					var activeTab = Ext.getClassName(newCard).split('.').pop();
					me.addHistory('Integration:showIntegration:' + activeTab);
				}
			},
			'[xtype="integration.settings"]': {
				'loadsettings': me.loadSettings
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
			me[showMethod](subSection, id);
		}
	},

	/**
	 * Load settings
	 *
	 * @param integrationPackageId
	 */
	loadSettings: function(integrationPackageId) {
		var me = this,
			field;

		NP.lib.core.Net.remoteCall({
			requests: {
				service					: 'IntegrationService',
				action					: 'getIntegrationSettings',
				integration_package_id	: integrationPackageId,
				success: function(result) {
					if (result) {
						var form = me.getCmp('integration.settings').down('[name="settingsform"]');
						for (var key in result) {
							if ((field = form.getForm().findField(key))) {
								field.setValue(result[key]);
							}
						}
					}
				}
			}
		});
	},

	/**
	 * Save settings
	 *
	 */
	saveSettings: function() {
		var me = this,
			form = me.getCmp('integration.settings').down('[name="settingsform"]');

		if (form.isValid()) {
			NP.lib.core.Net.remoteCall({
				method  : 'POST',
				mask    : form,
				requests: {
					service		: 'IntegrationService',
					action		: 'saveSettings',
					settings	: form.getValues(),
					success		: function(result) {
						console.log('retuls: ', result);
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
				service		: 'PnScheduleService',
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
			grid = me.getCmp('integration.taskstorungrid'),
			schedules = grid.getSelectionModel().getSelection();

		if (schedules.length > 0) {
			NP.lib.core.Net.remoteCall({
				method  : 'POST',
				mask    : grid,
				requests: {
					service               : 'PnScheduleService',
					action                : 'importOnDemandIntegration',
					userprofile_id: NP.Security.getUser().get('userprofile_id'),
					schedules   : schedules,
					success: function(result) {
						grid.getStore().commitChanges();
						NP.Util.showFadingWindow({ html: NP.Translator.translate('Import was completed successfully') });
					},
					failure: function(response, options) {
						grid.getStore().rejectChanges();
						Ext.MessageBox.alert(NP.Translator.translate('Error'), NP.Translator.translate('Cannot import tasks'));
					}
				}
			});
		}
	}

});