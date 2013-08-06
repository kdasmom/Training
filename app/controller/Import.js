/**
 * The Import controller deals with import/export utility in the Administration section of the app
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.controller.Import', {
    extend: 'NP.lib.core.AbstractController',
    requires: ['NP.lib.core.Config',
        'NP.lib.core.Net',
        'NP.lib.core.Util',
        'NP.lib.core.Security',
        'NP.view.shared.button.Inactivate',
        'NP.view.shared.button.Activate',
    ],
    refs: [
        {ref: 'overviewTab', selector: '[xtype="import.overview"]'},
        {ref: 'glTab', selector: '[xtype="import.gl"] '},
        {ref: 'propertyTab', selector: '[xtype="import.property"]'},
        {ref: 'vendorTab', selector: '[xtype="import.vendor"]'},
        {ref: 'invoiceTab', selector: '[xtype="import.invoice"]'},
        {ref: 'userTab', selector: '[xtype="import.user"]'},
        {ref: 'customFieldTab', selector: '[xtype="import.customField"]'},
        {ref: 'splitsTab', selector: '[xtype="import.splits"]'}
    ],
    file_upload: null,
    init: function() {
        Ext.log('Import controller initialized');

        var app = this.application;

        // Setup event handlers
        this.control({
            // Clicking on an import in an Overview tab
            '[xtype="import.main"]': {
                tabchange: function(tabPanel, newCard, oldCard, eOpts) {
                    var activeTab = Ext.getClassName(newCard).split('.').pop();
                    this.addHistory('Import:showImport:' + activeTab);
                }
            },
            // The Import tab GL
            '[xtype="import.gl"]  > verticaltabpanel': {
                itemclick: function(tabPanel, newCard, oldCard, eOpts) {
                    var activeTab = Ext.getClassName(newCard).split('.').pop();
                    this.addHistory('Import:showImport:GL:' + activeTab);
                }
            },
            // The Cancel button on the GL Category tab
            '[xtype="import.gl"] [xtype="shared.button.cancel"]': {
                // Run this whenever the upload button is clicked
                click: function() {
                    this.addHistory('Import:showImport');
                }
            },
            // The Upload button on the GL Category tab
            '[xtype="import.gl"] [xtype="shared.button.upload"]': {
                // Run this whenever the upload button is clicked
                click: this.uploadFile
            },
            // The Decline button on the GL Category tab
            '[xtype="import.gl"] [xtype="shared.button.inactivate"]': {
                // Run this whenever the upload button is clicked
                click: function() {
//                    this.deleteFile(file);
                    this.addHistory('Import:showImport:GL');
                    this.showFormUpload();
                }
            },
            // The Upload csv file
            '[xtype="import.gl"] [xtype="shared.button.activate"]': {
                click: function() {
                    that = this;
                    var grid = Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="panel"] [xtype="customgrid"]')[0];
                    var items = grid.getStore().data.items;
                    var accounts = [];
                    Ext.each(items, function(item) {
                        if ( item.data.validation_status.indexOf('buttons/activate') + 1) {
                            accounts.push(item.data);
                        }
                    });
                    if (accounts.length > 0) {
                        that.saveGrid(accounts);
                    } else {
                        NP.Util.showFadingWindow({html: 'No valid records to import.'});
                    }
                }
            }
        });
    },
    /**
     * Shows the import page with a specific tab open
     * @param {String} [activeTab="overview"] The tab currently active
     */
    showImport: function(activeTab) {
        var that = this;
        // Set the overview view
        var tabPanel = this.setView('NP.view.import.Main');

        // If no active tab is passed, default to Open
        if (!activeTab)
            activeTab = 'overview';

        // Check if the tab to be selected is already active, if it isn't make it the active tab
        var tab = that.getCmp('import.' + activeTab.toLowerCase());
        var tabPanel = Ext.ComponentQuery.query('tabpanel')[0];

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
    showGrid: function(file) {
        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="form"]')[0].setVisible(false);

        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="shared.button.upload"]')[0].setVisible(false);
        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="shared.button.upload"]')[1].setVisible(false);
        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="shared.button.cancel"]')[0].setVisible(false);
        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="shared.button.cancel"]')[1].setVisible(false);

        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="shared.button.inactivate"]')[0].setVisible(true);
        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="shared.button.inactivate"]')[1].setVisible(true);
        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="shared.button.activate"]')[0].setVisible(true);
        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="shared.button.activate"]')[1].setVisible(true);

        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="panel"]')[3].setVisible(true);
        
        var view = Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="import.glcode"]');
        
        var grid = Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="panel"] [xtype="customgrid"]')[0];
        var store = Ext.create('NP.store.gl.GlImportAccounts', {
             service: 'GLService',
             action: 'getCSVFile',
             paging: true,
             extraParams: {file: file}
         });
         grid.store = store;
         grid.getStore().load();
         grid.getView().refresh();
    },
    showFormUpload: function() {
        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="form"]')[0].setVisible(true);

        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="shared.button.upload"]')[0].setVisible(true);
        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="shared.button.upload"]')[1].setVisible(true);
        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="shared.button.cancel"]')[0].setVisible(true);
        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="shared.button.cancel"]')[1].setVisible(true);

        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="shared.button.inactivate"]')[0].setVisible(false);
        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="shared.button.inactivate"]')[1].setVisible(false);
        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="shared.button.activate"]')[0].setVisible(false);
        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="shared.button.activate"]')[1].setVisible(false);

        Ext.ComponentQuery.query('[xtype="import.gl"] [xtype="panel"]')[3].setVisible(false);

    },
    saveGrid: function(accounts, file) {
        var that = this;
        NP.lib.core.Net.remoteCall({
            method: 'POST',
            requests: {
                service: 'GLService',
                action: 'saveGrid',
                accounts: accounts,
                success: function(result, deferred) {
                    if (result.success) {
                        // Show friendly message
                        NP.Util.showFadingWindow({html: 'The valid GL Codes were uploaded successfully.'});
//                        this.deleteFile(file);
                        that.showFormUpload();
                        that.addHistory('Import:showImport:GL');
                    } else {
                        if (result.errors.length) {
                            NP.Util.showFadingWindow({html: 'Data from csv file not saved. Errors:' + result.errors[0]});
                        }
                    }
                },
                failure: function() {
                    Ext.log('Error save csv file');
                }
            }
        });

    },
    uploadFile: function() {
        var that = this;
        var formSelector = '[xtype="import.gl"] form';
        var form = Ext.ComponentQuery.query(formSelector)[0];
        // If form is valid, submit it
        if (form.getForm().isValid()) {
            var formEl = NP.Util.createFormForUpload(formSelector);
            var file = form.getForm().findField('file_upload_category').getValue();
            NP.lib.core.Net.remoteCall({
                method: 'POST',
                isUpload: true,
                form: formEl.id,
                requests: {
                    service: 'GLService',
                    action: 'uploadFile',
                    file: file,
                    success: function(result, deferred) {
                        if (result.success) {
                            // Show friendly message
                            that.showGrid(result.upload_filename);
                        } else {
                            if (result.errors.length) {
                                form.getForm().findField('file_upload_category').markInvalid(result.errors);
                            }
                        }
                        Ext.removeNode(formEl);
                    },
                    failure: function() {
                        Ext.log('Error upload csv file');
                    }
                }
            });
        }
    },
    deleteFile: function(file) {
        NP.lib.core.Net.remoteCall({
            method: 'POST',
            requests: {
                service: 'GLService',
                action: 'deleteFile',
                file: file,
                success: function(result, deferred) {
                    if (result.success) {
                        // Show friendly message
                        NP.Util.showFadingWindow({html: 'The file <b>' + file + '</b> has been deleted.'});
                    } else {
                        if (result.errors.length) {
                            NP.Util.showFadingWindow({html: 'The file <b>' + file + '</b> has not been deleted. Errors:' + result.errors[0]});
                        }
                    }
                },
                failure: function() {
                    Ext.log('Error save csv file');
                }
            }
        });
    }
});
