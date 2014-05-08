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
        'NP.view.shared.button.Activate'
    ],
    
    models: [
        'importing.GLBudget','importing.GLActual','importing.GLCategory',
        'importing.GLCode','importing.Property','importing.PropertyGL',
        'importing.Unit','importing.UnitType','importing.Vendor','importing.VendorGL',
        'importing.VendorFavorite','importing.VendorInsurance','importing.VendorUtility',
        'importing.InvoicePayment','importing.User','importing.UserProperty','importing.Split'
    ],

    views: [
        'importing.CSVGrid','importing.ImportSection','importing.Main','importing.Overview',
        'importing.UploadForm','importing.types.CustomFieldHeader','importing.types.CustomFieldLine',
        'importing.types.GLActual','importing.types.GLBudget','importing.types.GLCategory',
        'importing.types.GLCode','importing.types.InvoiceExport','importing.types.InvoicePayment',
        'importing.types.Property','importing.types.PropertyGL','importing.types.Split',
        'importing.types.Unit','importing.types.UnitType','importing.types.User',
        'importing.types.UserProperty','importing.types.Vendor','importing.types.VendorFavorite',
        'importing.types.VendorGL','importing.types.VendorInsurance','importing.types.VendorUtility'
    ],

    refs: [
        { ref: 'horizontalTab', selector: 'tabpanel' },
        { ref: 'overviewTab', selector: '[xtype="importing.overview"]' },
        { ref: 'glTab', selector: '[xtype="importing.gl"]' },
        { ref: 'propertyTab', selector: '[xtype="importing.property"]' },
        { ref: 'vendorTab', selector: '[xtype="importing.vendor"]' },
        { ref: 'invoiceTab', selector: '[xtype="importing.invoice"]' },
        { ref: 'userTab', selector: '[xtype="importing.user"]' },
        { ref: 'customFieldTab', selector: '[xtype="importing.customField"]' },
        { ref: 'splitsTab', selector: '[xtype="importing.splits"]' },
        { ref: 'previewGrid', selector: '[xtype="importing.csvgrid"] customgrid' }
    ],
    
    // For localization
    uploadSuccessText   : 'Data was successfully imported',
    uploadErrorText     : 'Some or all data from CSV files could not be saved. Errors:',
    errorDialogTitleText: 'Error',

    file_upload: null,
    
    init: function() {
        Ext.log('Import controller initialized');

        var app = this.application;

        // Setup event handlers
        this.control({
            // Clicking on an import in an Overview tab
            '[xtype="importing.main"]': {
                tabchange: function(tabPanel, newCard, oldCard, eOpts) {
                    this.addHistory('Import:showImport:' + this.getHorizontalTabToken(newCard));
                }
            },
            // The Import tab GL
            '[xtype="importing.main"] [xtype="verticaltabpanel"]': {
                tabchange: function(verticalTabPanel, newCard, oldCard, eOpts) {
                    var activeTab = this.getActiveHorizontalTab().getItemId().replace('ImportTab', '');
                    this.addHistory('Import:showImport:' + activeTab + ':' + this.getVerticalTabToken(newCard));
                }
            },
            // The Upload button on the GL Category tab
            '[xtype="importing.main"] [xtype="shared.button.upload"]': {
                // Run this whenever the upload button is clicked
                click: this.uploadFile
            },
            // The Decline button on the GL Category tab
            '[xtype="importing.main"] [xtype="shared.button.inactivate"]': {
                // Run this whenever the upload button is clicked
                click: this.decline
            },
            // The Upload csv file
            '[xtype="importing.main"] [xtype="shared.button.activate"]': {
                click: this.accept
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
        if (tab) {
            return tab.getItemId().replace('Panel', '');
        }
    },

    /**
     * Shows the import page with a specific tab open
     * @param {String} [activeTab="overview"] The tab currently active
     */
    showImport: function(activeTab, subSection, page) {
        var that = this;
        // Set the overview view
        var tabPanel = this.setView('NP.view.importing.Main');

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
        var verticalTabPanel = tabPanel.getActiveTab().query('verticaltabpanel');
        if (verticalTabPanel.length) {
            verticalTabPanel = verticalTabPanel[0];
            var verticalActiveTab = (subSection) ? Ext.ComponentQuery.query('#' + subSection + 'Panel')[0] : 0;
            verticalTabPanel.suspendEvents(false);
            verticalTabPanel.setActiveTab(verticalActiveTab);
            verticalTabPanel.resumeEvents();
        }

        if (activeTab != 'overview') {
            this.showFormUpload();
        }
    },

    showFormUpload: function() {
        var type = this.getVerticalTabToken(this.getActiveVerticalTab());
			var importItem = Ext.create('NP.view.importing.types.' + type);
		if (type !== 'InvoiceExport') {
			this.setView(importItem.getImportForm(), {}, '#' + this.getActiveVerticalTab().getItemId());
		} else {
			this.setView(importItem, {}, '#' + this.getActiveVerticalTab().getItemId());
		}
    },

    showGrid: function() {
        var type = this.getActiveVerticalTab().getItemId();
        var view = this.setView('NP.view.importing.CSVGrid', {
                    file: this.file,
                    type: type.replace('Panel', '')
                }, '#' + type);
        
        view.query('customgrid')[0].getStore().load();
    },

    uploadFile: function() {
        var that = this,
			activeTab = this.getActiveVerticalTab().getItemId();

		var form = this.getActiveVerticalTab().query('form')[0];
		// If form is valid, submit it
		if (form.getForm().isValid()) {
			if (activeTab !== 'InvoiceExportPanel') {
				var fileField = form.query('filefield')[0];
				var file = fileField.getValue();
				var formEl = NP.Util.createFormForUpload('#' + this.getActiveVerticalTab().getItemId() + ' form');

				NP.lib.core.Net.remoteCall({
					method: 'POST',
					mask: this.getActiveVerticalTab(),
					isUpload: true,
					form: formEl.id,
					requests: {
						service: 'ImportService',
						action: 'uploadCSV',
						file: file,
						type: this.getVerticalTabToken(this.getActiveVerticalTab()),
						fileFieldName: fileField.getName(),
						success: function (result) {
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
			} else {
				var reportWinName = 'report_invoice.Export',
					body          = Ext.getBody(),
					win           = window.open('about:blank', reportWinName);

				Ext.DomHelper.append(
					body,
					'<form id="__reportForm" action="export.php" target="' + reportWinName + '" method="post">' +
					'<input type="hidden" id="__report" name="report" />' +
					'<input type="hidden" id="__format" name="format" />' +
					'<input type="hidden" id="__options" name="options" />' +
					'<input type="hidden" id="__extraParams" name="extraParams" />' +
					'</form>'
				);

				Ext.get('__report').set({ value: 'invoice.Export' });
				Ext.get('__format').set({ value: 'excel' });
				Ext.get('__extraParams').set({ value: Ext.JSON.encode(form.getForm().getValues()) });
				var formExport = Ext.get('__reportForm');
				formExport.dom.submit();
				Ext.destroy(formExport);
			}
		}
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
    },

    accept: function() {
        that = this;
        
        var grid = Ext.ComponentQuery.query('[xtype="importing.csvgrid"] [xtype="customgrid"]')[0];
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
            NP.Util.showFadingWindow({html: 'No valid records to importing.'});
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
                success: function(result) {
                    if (result.success) {
                        // Show friendly message
                        NP.Util.showFadingWindow({ html: that.uploadSuccessText });
                        that.showFormUpload();
                    } else {
                        Ext.MessageBox.alert(
                            that.errorDialogTitleText,
                            that.uploadErrorText + '<br /><br />' + result.error
                        );
                        that.showFormUpload();
                    }
                }
            }
        });
    }
});