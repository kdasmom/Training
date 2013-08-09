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
        { ref: 'horizontalTab', selector: 'tabpanel' },
        { ref: 'overviewTab', selector: '[xtype="import.overview"]' },
        { ref: 'glTab', selector: '[xtype="import.gl"]' },
        { ref: 'propertyTab', selector: '[xtype="import.property"]' },
        { ref: 'vendorTab', selector: '[xtype="import.vendor"]' },
        { ref: 'invoiceTab', selector: '[xtype="import.invoice"]' },
        { ref: 'userTab', selector: '[xtype="import.user"]' },
        { ref: 'customFieldTab', selector: '[xtype="import.customField"]' },
        { ref: 'splitsTab', selector: '[xtype="import.splits"]' },
        { ref: 'previewGrid', selector: '[xtype="import.csvgrid"] customgrid' }
    ],
    
    // For localization
    uploadSuccessText: 'Data was successfully imported',
    uploadErrorText  : 'Data from CSV file not saved. Errors: ',

    file_upload: null,
    
    init: function() {
        Ext.log('Import controller initialized');

        var app = this.application;

        // Setup event handlers
        this.control({
            // Clicking on an import in an Overview tab
            '[xtype="import.main"]': {
                tabchange: function(tabPanel, newCard, oldCard, eOpts) {
                    this.addHistory('Import:showImport:' + this.getHorizontalTabToken(newCard));
                }
            },
            // The Import tab GL
            '[xtype="import.main"] [xtype="verticaltabpanel"]': {
                tabchange: function(verticalTabPanel, newCard, oldCard, eOpts) {
                    var activeTab = this.getActiveHorizontalTab().getItemId().replace('ImportTab', '');
                    this.addHistory('Import:showImport:' + activeTab + ':' + this.getVerticalTabToken(newCard));
                }
            },
            // The Upload button on the GL Category tab
            '[xtype="import.main"] [xtype="shared.button.upload"]': {
                // Run this whenever the upload button is clicked
                click: this.uploadFile
            },
            // The Decline button on the GL Category tab
            '[xtype="import.main"] [xtype="shared.button.inactivate"]': {
                // Run this whenever the upload button is clicked
                click: this.decline
            },
            // The Upload csv file
            '[xtype="import.main"] [xtype="shared.button.activate"]': {
                click: function() {
                    that = this;
                    var grid = Ext.ComponentQuery.query('[xtype="import.csvgrid"] [xtype="customgrid"]')[0];
                    var items = grid.getStore().getRange();
                    var hasValid = false;
                    Ext.each(items, function(item) {
                        if (item.get('validation_status') == 'valid') {
                            hasValid = true;
                            return false;
                        }
                    });
                    if (hasValid > 0) {
                        that.saveGrid();
                    } else {
                        NP.Util.showFadingWindow({html: 'No valid records to import.'});
                    }
                }
            }
        });
    },

    getActiveHorizontalTab: function() {
        return this.getHorizontalTab().getActiveTab();
    },

    getHorizontalTabToken: function(tab) {
        return tab.getItemId().replace('ImportTab', '');
    },

    getActiveVerticalTab: function() {
        var verticalTabPanel = this.getHorizontalTab().getActiveTab().query('verticaltabpanel');
        if (verticalTabPanel.length) {
            return verticalTabPanel[0].getActiveTab();
        } else {
            return this.getHorizontalTab().getActiveTab().down('panel');
        }
    },

    getVerticalTabToken: function(tab) {
        return tab.getItemId().replace('Panel', '');
    },

    /**
     * Shows the import page with a specific tab open
     * @param {String} [activeTab="overview"] The tab currently active
     */
    showImport: function(activeTab, subSection, page) {
        var that = this;
        // Set the overview view
        var tabPanel = this.setView('NP.view.import.Main');

        // If no active tab is passed, default to Open
        if (!activeTab)
            activeTab = 'overview';

        // Check if the tab to be selected is already active, if it isn't make it the active tab
        var tab = Ext.ComponentQuery.query('#' + activeTab + 'ImportTab')[0];
        var tabPanel = this.getHorizontalTab();

        // Set the active tab if it hasn't been set yet
        if (tab.getItemId() != tabPanel.getActiveTab().getItemId()) {
            tabPanel.suspendEvents(false);
            tabPanel.setActiveTab(tab);
            tabPanel.resumeEvents();
        }

        // Set the active vertical tab if it hasn't been set yet
        var verticalTabPanel = tabPanel.query('verticaltabpanel');
        if (verticalTabPanel.length) {
            verticalTabPanel = verticalTabPanel[0];
            var verticalActiveTab = (subSection) ? Ext.ComponentQuery.query('#' + subSection + 'Panel')[0] : 0;
            verticalTabPanel.suspendEvents(false);
            verticalTabPanel.setActiveTab(verticalActiveTab);
            verticalTabPanel.resumeEvents();
        }

        this.showFormUpload();
    },

    showFormUpload: function() {
        var type = this.getVerticalTabToken(this.getActiveVerticalTab());
        var importItem = Ext.create('NP.view.import.types.' + type);
        this.setView(importItem.getImportForm(), {}, '#' + this.getActiveVerticalTab().getItemId());
    },

    showGrid: function() {
        var type = this.getActiveVerticalTab().getItemId();
        var view = this.setView('NP.view.import.CSVGrid', {
                    file: this.file,
                    type: type.replace('Panel', '')
                }, '#' + type);
        
        view.query('customgrid')[0].getStore().load();
    },

    uploadFile: function() {
        var that = this;
        
        var form = this.getActiveVerticalTab().query('form')[0];
        // If form is valid, submit it
        if (form.getForm().isValid()) {
            var fileField = form.query('filefield')[0];
            var file = fileField.getValue();
            var formEl = NP.Util.createFormForUpload('#' + this.getActiveVerticalTab().getItemId() + ' form');
            
            NP.lib.core.Net.remoteCall({
                method: 'POST',
                mask  : this.getActiveVerticalTab(),
                isUpload: true,
                form: formEl.id,
                requests: {
                    service      : 'ImportService',
                    action       : 'uploadCSV',
                    file         : file,
                    type         : this.getVerticalTabToken(this.getActiveVerticalTab()),
                    fileFieldName: fileField.getName(),
                    success      : function(result, deferred) {
                        if (result.success) {
                            // Save file name
                            that.file = result.upload_filename;
                            // Show the preview grid
                            that.showGrid();
                        } else {
                            if (result.errors.length) {
                                fileField.markInvalid(result.errors);
                            }
                        }
                        Ext.removeNode(formEl);
                    }
                }
            });
        }
    },

    saveGrid: function() {
        var that = this;

        var type = this.getVerticalTabToken(this.getActiveVerticalTab());

        NP.lib.core.Net.remoteCall({
            method: 'POST',
            mask  : this.getActiveVerticalTab(),
            requests: {
                service: 'ImportService',
                action : 'accept',
                file   : this.file,
                type   : type,
                success: function(result, deferred) {
                    if (result.success) {
                        // Show friendly message
                        NP.Util.showFadingWindow({ html: that.uploadSuccessText });
                        that.showFormUpload();
                    } else {
                        if (result.errors.length) {
                            NP.Util.showFadingWindow({ html: that.uploadErrorText + result.errors[0] });
                        }
                    }
                }
            }
        });
    },

    decline: function() {
        // Declining the upload will delete the file, if the file deletion fails it's not a big deal, so we don't
        // need to check for success or failure
        NP.lib.core.Net.remoteCall({
            method: 'POST',
            requests: {
                service: 'ImportService',
                action : 'decline',
                file   : this.file,
                type   : this.getVerticalTabToken(this.getActiveVerticalTab())
            }
        });

        this.showFormUpload();
    }
});
