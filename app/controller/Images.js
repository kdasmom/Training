Ext.define('NP.controller.Images', {
    extend: 'NP.lib.core.AbstractController',

    init: function() {
        var control = {};

        this.controlMain(control);
        this.controlIndex(control);
        this.controlSearch(control);
        this.controlSearchCDIndex(control);
        this.controlSearchDeleted(control);

        this.control(control);
    },

    /**
     * Bind actions for Main Screen.
     */
    controlMain: function(control) {
        var prefix = '[xtype="images.main"] ';

        control[prefix + 'tabpanel'] = {
            tabchange: this.processTabChange.bind(this)
        };
        control[prefix + 'tabpanel > grid'] = {
            itemclick: this.processCellClick.bind(this)
        };
        control[prefix + '[itemId~="componentContextPicker"]'] = {
            change: this.processComponentContextPicker.bind(this)
        };

        control[prefix + 'button[itemId~="buttonIndex"]'] = {
            click: this.processButtonIndex.bind(this)
        };
        control[prefix + 'button[itemId~="buttonDelete"]'] = {
            click: this.processButtonDelete.bind(this)
        };
        control[prefix + 'button[itemId~="buttonConvert"]'] = {
            click: this.processButtonConvert.bind(this)
        };
        control[prefix + 'button[itemId~="buttonRevert"]'] = {
            click: this.processButtonRevert.bind(this)
        };

        control[prefix + 'button[itemId~="buttonUpload"]'] = {
            click: this.processButtonUpload.bind(this)
        };
        control[prefix + 'button[itemId~="buttonNPISS"]'] = {
            click: this.processButtonNPISS.bind(this)
        };
        control[prefix + 'button[itemId~="buttonNSISS"]'] = {
            click: this.processButtonNSISS.bind(this)
        };

        control[prefix + 'button[itemId~="buttonReport"]'] = {
            click: this.processButtonReport.bind(this)
        };
        control[prefix + 'button[itemId~="buttonSearch"]'] = {
            click: this.processButtonSearch.bind(this)
        };
        control[prefix + 'button[itemId~="buttonSearchDeleted"]'] = {
            click: this.processButtonSearchDeleted.bind(this)
        };

        control[prefix + 'button[itemId~="buttonDeletePermanently"]'] = {
            click: this.processButtonDeletePermanently.bind(this)
        };
    },

    /**
     * Bind actions for Index Screen.
     */
    controlIndex: function(control) {
        var prefix = '[xtype="images.index"] ';

        // Top bar buttons.
        control[prefix + 'button[itemId~="buttonPrev"]'] = {
            click: this.processButtonPrev
        };

        control[prefix + 'button[itemId~="buttonSaveAndPrev"]'] = {
            click: this.processButtonSaveAndPrev
        };

        control[prefix + 'button[itemId~="buttonSaveAsException"]'] = {
            click: this.processButtonSaveAsException
        };

        control[prefix + 'button[itemId~="buttonReturn"]'] = {
            click: this.processButtonReturn
        };

        control[prefix + 'button[itemId~="buttonDeleteFromQueue"]'] = {
            click: this.processButtonDeleteFromQueue
        }

        control[prefix + 'button[itemId~="buttonSaveAndNext"]'] = {
            click: this.processButtonSaveAndNext
        };

        control[prefix + 'button[itemId~="buttonNext"]'] = {
            click: this.processButtonNext
        };

        control[prefix + 'button[itemId~="buttonInvoice"]'] = {
            click: this.processButtonInvoice
        };

        control[prefix + 'button[itemId~="buttonIndexingComplete"]'] = {
            click: this.processButtonIndexingComplete
        };

        // Form buttons.
        control[prefix + 'button[itemId~="buttonSaveAndNextAction"]'] = {
            click: this.processButtonSaveAndNext
        };
        control[prefix + 'button[itemId~="buttonSaveAsExceptionAction"]'] = {
            click: this.processButtonSaveAsException
        };
        control[prefix + 'button[itemId~="buttonInvoiceAction"]'] = {
            click: this.processButtonInvoice
        };
    },

    /**
     * Bind actions for Search Screen.
     */
    controlSearch: function(control) {
        var prefix = '[xtype="images.search"] ';

        control[prefix + 'button[itemId~="buttonReturn"]'] = {
            click: this.processButtonReturn
        };

        control[prefix + 'button[itemId~="buttonSearchProcess"]'] = {
            click: this.processButtonSearchProcess
        };
        control[prefix + 'button[itemId~="buttonSearchCDIndex"]'] = {
            click: this.processButtonSearchCDIndex
        };

        control[prefix + 'button[itemId~="buttonSearchProcessAction"]'] = {
            click: this.processButtonSearchProcess
        };
    },

    /**
     * Bind actions for Search CD Index Screen.
     */
    controlSearchCDIndex: function(control) {
        var prefix = '[xtype="images.searchcdindex"] ';

        control[prefix + 'button[itemId~="buttonReturn"]'] = {
            click: this.processButtonReturn
        };
        
        control[prefix + 'button[itemId~="buttonSearchCDIndexProcess"]'] = {
            click: this.processButtonSearchCDIndexProcess
        };
        control[prefix + 'button[itemId~="buttonSearchCDIndexPrint"]'] = {
            click: this.processButtonSearchCDIndexPrint
        };
        
        control[prefix + 'button[itemId~="buttonSearchCDIndexProcessAction"]'] = {
            click: this.processButtonSearchCDIndexProcess
        };
    },

    /**
     * Bind actions for Search Deleted Screen.
     */
    controlSearchDeleted: function(control) {
        var prefix = '[xtype="images.searchdeleted"] ';

        control[prefix + 'button[itemId~="buttonReturn"]'] = {
            click: this.processButtonReturn
        };
    
        control[prefix + 'button[itemId~="buttonSearchDeletedProcess"]'] = {
            click: this.processButtonSearchDeletedProcess
        };
    },

    /**
     * Bind actions for Report Screen.
     */
    controlReport: function(control) {
        var prefix = '[xtype="images.report"] ';

        control[prefix + 'button[itemId~="buttonReturn"]'] = {
            click: this.processButtonReturn
        };

        control[prefix + 'button[itemId~="buttonSearch"]'] = {
            click: this.processButtonSearch
        };
        control[prefix + 'button[itemId~="buttonGenerateReport"]'] = {
            click: this.processButtonGenerateReport
        };
    },

    /***************************************************************************
     * View: Main
     **************************************************************************/
    /**
     * Show Main Screen.
     * 
     * @param tab Identifier of the tab which should be displayed.
     */
    showMain: function(tab) {
        if (tab == 'search') {
            this.application.addHistory('Images:showSearch');
            return;
        };

        this.application.setView('NP.view.images.Main');

        var active = this.getCurrent();
        var target = Ext.ComponentQuery.query(
            '[itemId="images-' + (tab || 'index') + '"]'
        )[0];

        if (target && active && target.getItemId() != active.getActiveTab().getItemId()) {
            active.setActiveTab(target);
        }

        var current = 
            this.getCurrentGrid()
        ;
        current && 
            current.store && 
            current.store.reload()
        ;
    },

    /**
     * Appropriate tab(grid) should be displayed when tab is changed.
     * 
     * @param panel Main screen tab panel.
     * @param newTab Tab which should be displayed.
     * @param oldTab Tab which was active before tab change.
     * @param options Additional options.
     */
    processTabChange: function(panel, newTab, oldTab, options) {
        var grid = this.getCurrentGrid();
        if (grid) {
            var tabid = grid.getItemId().
                replace('images-', '').toLowerCase()
            ;
            this.application.addHistory('Images:showMain:' + tabid);
        }
    },

    /**
     * Associated image should be displayed when grid cell is clicked in a new window.
     * 
     * @param grid Grid object.
     * @param record Record model.
     * @param item Current Grid row.
     * @param index Record index/row number(position in grid).
     * @param event Javascript click event.
     * @param options Additional options.
     */
    processCellClick: function(grid, record, item, index, event, options) {
        if (event.getTarget().className != 'x-grid-row-checker') {
            window.open(
                '/ajax.php?service=ImageService&action=show&image_id=' + record.internalId,
                '_blank',
                'width=740, height=625, resizable=yes, scrollbars=yes'
            );
        }
    },

    /**
     * Grid should be reloaded with correct parameters if context is changed.
     * 
     * @param toolbar Context Picker Component.
     * @param filterType Type of the filter: Current Property | Region | All properties.
     * @param selected Identifier of the selected item in the combobox (Property or Region).
     */
    processComponentContextPicker: function(toolbar, filterType, selected) {
        var contentView = this.application.getCurrentView();

        // If user picks a different property/region and we're on a register, update the grid.
        if (contentView.getXType() == 'images.main') {
            var grid = this.getCurrentGrid();
            var state = Ext.ComponentQuery.query(
                '[xtype="shared.contextpicker"]'
            )[0].getState();

            grid.getStore().load({
                params: {
                    contextType     : state.type,
                    contextSelection: state.selected
                }
            })
        }
    },

    /**
     * Open Index Screen.
     */
    processButtonIndex: function() {
        this.application.addHistory('Images:showIndex');
    },

    /**
     * Delete selected images.
     */
    processButtonDelete: function() {
        var grid = this.getCurrentGrid();
        var selection = this.getCurrentSelection();

        if (selection) {
            NP.lib.core.Net.remoteCall({
                requests: {
                    service: 'ImageService',
                    action : 'delete',

                    userprofile_id              : NP.Security.getUser().get('userprofile_id'),
                    delegated_to_userprofile_id : NP.Security.getDelegatedToUser().get('userprofile_id'),

                    identifiers: '[' + selection.join(',') + ']',

                    success: function(result) {
                        if (result.success) {
                            NP.Util.showFadingWindow(
                                {
                                    html: 'Images Deleted'
                                }
                            );
                            grid.store.reload();
                        }
                    }
                }
            });
        }
    },

    /**
     * Convert selected images.
     */
    processButtonConvert: function() {
        Ext.MessageBox.alert('Convert image', 'Coming soon');
    },

    /**
     * Revert selected images.
     */
    processButtonRevert: function() {
        var grid = this.getCurrentGrid();
        var selection = this.getCurrentSelection();

        if (selection) {
            NP.lib.core.Net.remoteCall({
                requests: {
                    service: 'ImageService',
                    action : 'revert',

                    identifiers: '[' + selection.join(',') + ']',

                    success: function(result) {
                        if (result.success) {
                            NP.Util.showFadingWindow(
                                {
                                    html: 'Images Reverted'
                                }
                            );
                            grid.store.reload();
                        }
                    }
                }
            });
        }
    },

    /**
     * Show uploader window.
     * After window is closed, current grid should be reloaded to get latest information.
     */
    processButtonUpload: function() {
        var self = this;
        Ext.create('NP.lib.ui.Uploader', {
            params: {
                form: {
                    action:  'upload',
                    service: 'ImageService'
                },
                listeners: {
                    close: function(){
                        var grid = self.getCurrentGrid();
                        grid.store.reload();
                    }
                }
            }
        }).show();
    },

    /**
     * Open Nexus Payables Invoice Separator Sheet in a new window.
     */
    processButtonNPISS: function() {
        window.open('/resources/files/NexusBarcodeSeparator.pdf', 'BarCode_Window', 'width=740, height=625, resizable=yes, scrollbars=yes');
    },

    /**
     * Open Nexus Services Invoice Separator Sheet in a new window.
     */
    processButtonNSISS: function() {
        window.open('/resources/files/KofaxBarcode.pdf', 'BarCode_Window', 'width=740, height=625, resizable=yes, scrollbars=yes');
    },

    /**
     * Open Report Screen.
     */
    processButtonReport: function() {
        this.application.addHistory('Images:showReport');
    },

    /**
     * Open Search Screen.
     */
    processButtonSearch: function() {
        this.application.addHistory('Images:showSearch');
    },

    /**
     * Open Search Deleted Screen.
     */
    processButtonSearchDeleted: function() {
        this.application.addHistory('Images:showSearchDeleted');
    },

    /**
     * Delete selected images permanently.
     */
    processButtonDeletePermanently: function() {
        var grid = this.getCurrentGrid();
        var selection = this.getCurrentSelection();

        if (selection) {
            NP.lib.core.Net.remoteCall({
                requests: {
                    service: 'ImageService',
                    action : 'delete',

                    userprofile_id              : NP.Security.getUser().get('userprofile_id'),
                    delegated_to_userprofile_id : NP.Security.getDelegatedToUser().get('userprofile_id'),

                    identifiers: '[' + selection.join(',') + ']',
                    permanently: true,

                    success: function(result) {
                        if (result.success) {
                            NP.Util.showFadingWindow(
                                {
                                    html: 'Images Deleted Permanently'
                                }
                            );
                            grid.store.reload();
                        }
                    }
                }
            });
        }
    },

    /***************************************************************************
     * View: Index
     **************************************************************************/
    /**
     * Show Index Screen.
     */
    showIndex: function() {
        var grid = this.getCurrentGrid();
        var selection = this.getCurrentSelection();

        // Find current section.
        var section = 'index';
        if (grid) {
            if (grid.getXType() == 'images.grid.Exceptions') {
                section = 'exception';
            }
        }

        if (selection) {
            // Put images into queue.
            var items = [];
            for(var i = 0, l=selection.length; i<l; i++) {
                items.push(selection[i]);
            }
            this.queueImages(items);

            // Prepare view configuration.
            var viewCfg = {
                section: section,
                bind: {
                    models: ['image.ImageIndex'],
                    service : 'ImageService',
                    action  : 'get',
                    extraParams: {
                        id: this.imageQueue[this.imageQueueCurrent]
                    }
                },
                listeners: {
                    dataloaded: function (form, data) {
                        if (data['utilityaccount_id']) {
                            var uproperty = Ext.ComponentQuery.query('[name="utility_property_id"]')[0];
                            uproperty && uproperty.setValue(data['Property_Id']);

                            var uvendorsite = Ext.ComponentQuery.query('[name="utility_vendorsite_id"]')[0];
                            uvendorsite && uvendorsite.setValue(data['Image_Index_VendorSite_Id']);
                        }

                        var doctype = Ext.ComponentQuery.query('[name="Image_Doctype_Id"]')[0];
                        if (!doctype.getValue()) {
                            var doctypeValue = 
                                this['preload-store'].doctype.totalCount && 
                                this['preload-store'].doctype.data.keys[0]
                            ;
                            doctype.setValue(doctypeValue);
                        }
                    }
                }
            };

            var self = this;
            // Preload stores.
            this.loadStores(function(storeDoctypes, storeIntegrationPackages){
                viewCfg['preload-store'] = {
                    doctype: storeDoctypes,
                    integrationPackage: storeIntegrationPackages
                };

                // Show Index Screen.
                self.application.setView('NP.view.images.Index', viewCfg);
                // Set Correct title.
                Ext.ComponentQuery.query('panel[id="panel-index"]')[0].setTitle('Image Index - ' + self.imageQueue[self.imageQueueCurrent]);
                // Set correct url for iframe.
                self.refreshIndex();
            })
        } else {
            this.processButtonReturn();
        }
    },

    /**
     * Preload necessary stores.
     * Before Index screen will be displayed all necessary stores for comboboxes should be loaded.
     * 
     * @param Function callback Method will be called after all necessary stores be loaded.
     */
    loadStores: function(callback) {
        var storeDoctypes = 
            Ext.create('NP.store.images.ImageDocTypes',{
                service    : 'ImageService',
                action     : 'listDocTypes'
            }
        );
        var storeIntegrationPackages =
            Ext.create('NP.store.images.IntegrationPackages', {
                service    : 'ImageService',
                action     : 'listIntegrationPackages'
            }
        );

        storeDoctypes.load(function(records, operation, success) {
            storeIntegrationPackages.load(function(records, operation, success) {
                callback && callback(storeDoctypes, storeIntegrationPackages);
            });
        });
    },

    /**
     * Refresh Index Form when "Next", "Previous", "Save and Next" or "Save and Previous" is clicked.
     * Method will get correct identifier of the image from the image queue (this.imageQueue) array.
     */
    updateIndex: function() {
        var self = this;

        var form = this.getCmp(
            'images.index'
        );
        var mask = new Ext.LoadMask(form);

        // Show blocking "Loading" screen.
        mask.show();

        // Get image data from the server.
        NP.lib.core.Net.remoteCall({
            requests: {
                service: form.bind.service,
		action : form.bind.action,

                id: this.imageQueue[this.imageQueueCurrent],
                filter: {
                    userprofile_id              : NP.Security.getUser().get('userprofile_id'),
                    delegated_to_userprofile_id : NP.Security.getDelegatedToUser().get('userprofile_id')//,
                },

                success: function(result, deferred) {
                    // Models and fields should be updated when data from server is returned.
                    form.fireEvent('beforemodelupdate', form, result);
                    if (result !== null) {
                        form.updateModels(result);
                    }

                    form.fireEvent('beforefieldupdate', form, result);
                    form.updateBoundFields();

                    if (form.bind.extraFields) {
                        Ext.Array.each(form.bind.extraFields, function(fieldName) {
                            var field = form.findField(fieldName);
                            if (field && result[fieldName]) {
                                field.setValue(result[fieldName]);
                            }
                        });
                    }
                    form.fireEvent('dataloaded', form, result);

                    // Set Correct title.
                    Ext.ComponentQuery.query('panel[id="panel-index"]')[0].setTitle('Image Index - ' + self.imageQueue[self.imageQueueCurrent]);
                    // Set correct url for iframe.
                    self.refreshIndex();

                    var element = 
                        Ext.ComponentQuery.query('[name="Property_Alt_Id"]')[0]
                    ;
                    element.setValue(result['Property_Id']);
                    result['Property_Id'] ?
                        element.disable():
                        element.enable()
                    ;

                    element = 
                        Ext.ComponentQuery.query('[name="invoiceimage_vendorsite_alt_id"]')[0]
                    ;
                    element.setValue(result['Image_Index_VendorSite_Id']);
                    result['Image_Index_VendorSite_Id'] ?
                        element.disable():
                        element.enable()
                    ;

                    // Remove blocking "Loading" screen.
                    mask.destroy();
                }
            }
        });
    },

    /**
     * Load appropriate image to the iframe.
     */
    refreshIndex: function() {
        var params = [
            'service=ImageService',
            'action=show',
            'image_id='
        ];
        Ext.getDom('iframe-panel').src = '/ajax.php?' + params.join('&') + this.imageQueue[this.imageQueueCurrent];
    },

    /**
     * Open Previous Image from Queue in the Index Image Form.
     * If this method is called after image is saved then such image should be removed from the queue.
     */
    processButtonPrev: function(remove) {
        if (remove === true) {
            this.imageQueue.splice(this.imageQueueCurrent, 1);
            if (this.imageQueue.length == 0) {
                // Return to the main screen
                this.imageQueueCurrent = 0;
                this.processButtonReturn();
            } else {
                this.updateIndex();
            }
        } else {
            if (this.imageQueueCurrent > 0) {
                this.imageQueueCurrent--;
                this.updateIndex();
            }
        }
    },

    /**
     * Save current image and move to the previous image.
     */
    processButtonSaveAndPrev: function() {
        this.saveImageIndex('index', 'index', this.processButtonPrev.bind(this));
    },

    /**
     * Save current image, mark it as Exception.
     */
    processButtonSaveAsException: function() {
        this.saveImageIndex('exception', 'index', this.processButtonNext.bind(this));
    },

    /**
     * Show Main Screen.
     */
    processButtonReturn: function() {
        this.application.addHistory('Images:showMain');
    },

    /**
     * Delete Image from Index Image Screen.
     */
    processButtonDeleteFromQueue: function() {
        if (this.imageQueue[this.imageQueueCurrent]) {
            var self = this;
            NP.lib.core.Net.remoteCall({
                requests: {
                    service: 'ImageService',
                    action : 'delete',

                    identifiers: '[' + this.imageQueue[this.imageQueueCurrent] + ']',

                    success: function(result) {
                        if (result.success) {
                            NP.Util.showFadingWindow(
                                {
                                    html: 'Images Deleted'
                                }
                            );
                            self.application.setView('NP.view.images.Main');
                        }
                    }
                }
            });
        }
    },

    /**
     * Save current image and move to the next image.
     */
    processButtonSaveAndNext: function() {
        this.saveImageIndex('index', 'index', this.processButtonNext.bind(this));
    },

    /**
     * Open Next Image from Queue in the Index Image Form.
     * If this method is called after image is saved then such image should be removed from the queue.
     */
    processButtonNext: function(remove) {
        if (remove === true) {
            this.imageQueue.splice(this.imageQueueCurrent, 1);
            if (this.imageQueue.length == 0) {
                // Return to the main screen
                this.imageQueueCurrent = 0;
                this.processButtonReturn();
            } else {
                this.updateIndex();
            }
        } else {
            if (this.imageQueueCurrent < this.imageQueue.length - 1) {
                this.imageQueueCurrent++;
                this.updateIndex();
            }
        }
    },

    /**
     * Open Create Invoice Screen.
     */
    processButtonInvoice: function() {
        //this.application.addHistory('Invoice:showView');
        Ext.MessageBox.alert('Create Invoice', 'Coming soon');
    },

    /**
     * Save image and go to next image.
     * Image indexing should be completed when Image was marked as exception.
     * This method is specific for the "Exception" tab/secion.
     */
    processButtonIndexingComplete: function() {
        this.saveImageIndex('complete', 'index', this.processButtonNext.bind(this));
    },

    /**
     * Unified universal method for saving images.
     * After image will be saved on the server side, callback will be called.
     * 
     * @param String action Action which defines is this usual indexing('index'), saving an exception('exception'),
     *      completing index operation('complete').
     * @param String section Current section/tab name('index' or 'exception'). This parameter is needed for correct
     *      declaring default values at the image.
     * @param Function callback Function which will be called after saving will be processed.
     */
    saveImageIndex: function(action, section, callback) {
        var form = this.getCmp('images.index');
        form.updateBoundModels();

        var model = form.bind.models[0].instance;
        if (model.data['Image_Doctype_Id'] != 6) {
            if (model.validations.length == 1) {
                model.validations.push(
                    { field: 'Image_Index_VendorSite_Id', type: 'presence' },
                    { field: 'invoiceimage_vendorsite_alt_id', type: 'presence' },
                    { field: 'Property_Id', type: 'presence' },
                    { field: 'Property_Alt_Id', type: 'presence' }
                );
            }
        }
        if (action == 'exception') {
            model.validations.push(
                { field: 'Image_Index_Exception_reason', type: 'presence' }
            );
        }

        if (form.isValid()) {
            form.submitWithBindings({
                action: 'update',
                service: 'ImageService',
                extraParams: {
                    params: {
                        action: action,// || exception || index complete
                        section: section,//|| exception
                        userprofile_id              : NP.Security.getUser().get('userprofile_id'),
                        delegated_to_userprofile_id : NP.Security.getDelegatedToUser().get('userprofile_id')
                    }
                },
                success: function(result) {
                    callback && callback(true);
                }
            });
        }
        model.validations = [
            { field: 'Image_Doctype_Id', type: 'presence' }
        ];
    },

    /**
     * Image identifiers which are passed to the Index Screen for indexing are stored in this queue.
     * This queue allows user to go to next and previous images at the Index Screen.
     * When "Save and Next", "Save as Exception", "Save and Previous" or "Indexing Complete and Next" 
     * actions are processed appropriate images are deleted from this queue because images are marked 
     * as processed and the following work with such images is available in the other parts of the 
     * system.
     */
    imageQueue: [],
    /**
     * Image index at the queue which is active in the Index Screen is placed at this variable.
     */
    imageQueueCurrent: 0,
    /**
     * Place image identifiers to the queue.
     * 
     * @param [] List of the images which should be placed to the queue.
     */
    queueImages: function(images) {
        this.imageQueue = images;
        this.imageQueueCurrent = 0;
    },
    /**
     * Clear queue.
     * Reset current image index to the 0.
     */
    clearImages: function() {
        this.imageQueue = [];
        this.imageQueueCurrent = 0;
    },

    /***************************************************************************
     * View: Search
     **************************************************************************/
    /**
     * Show Search Screen
     */
    showSearch: function() {
        this.application.setView('NP.view.images.Search');
    },

    /**
     * Search images.
     * Method requests data from the server and places it to the search result grid.
     */
    processButtonSearchProcess: function() {
        var searchtype = Ext.ComponentQuery.query(
            '[itemId="field-image-searchtype"]'
        )[0];

        var imagename = Ext.ComponentQuery.query(
            '[itemId="field-image-name"]'
        )[0];
        var scandate = Ext.ComponentQuery.query(
            '[itemId="field-scan-date"]'
        )[0];
        var vendor = Ext.ComponentQuery.query(
            '[itemId="field-vendor"]'
        )[0];

        if (searchtype.getValue() == 1 && imagename.getValue().length < 4) {
            Ext.MessageBox.alert('Search Images', 'Please enter an image name with more than 4 characters.');
            imagename.focus();
        } else if (searchtype.getValue() == 2 && scandate.getValue() == '') {
            Ext.MessageBox.alert('Search Images', 'Please enter a scan date.');
            scandate.focus();
        } else if (searchtype.getValue() == 3 && vendor.getValue().length < 4) {
            Ext.MessageBox.alert('Search Images', 'Please enter an image name with more than 4 characters.');
            vendor.focus();
        } else {
            var searchstring = '';
            if (searchtype.getValue() == 1) {
                searchstring = imagename.getValue();
            } else if (searchtype.getValue() == 2) {
                searchstring = scandate.getValue();
            } else if (searchtype.getValue() == 3) {
                searchstring = vendor.getValue();
            }

            var result = Ext.ComponentQuery.query(
                '[itemId="grid-search-results"]'
            )[0];

            var doctype = Ext.ComponentQuery.query(
                '[itemId="field-image-doctype"]'
            )[0];

            var contextpicker = Ext.ComponentQuery.query(
                '[xtype="shared.contextpickermulti"]'
            )[0];

            var params = {
                doctype: doctype.getValue(),
                searchtype: searchtype.getValue(),
                searchstring: searchstring,

                contextType     : contextpicker.getState().type,
                contextSelection: contextpicker.getState().selected
            }

            if (params.contextSelection && params.contextSelection.join) {
                params.contextSelection = params.contextSelection.join(',');
            }

            result.store.load({params: params});
        }
    },

    /**
     * Open Search CD Index Screen
     */
    processButtonSearchCDIndex: function() {
        this.application.addHistory('Images:showSearchCDIndex');
    },

    /***************************************************************************
     * View: Search CD Index
     **************************************************************************/
    /**
     * Show Search CD Index Screen
     */
    showSearchCDIndex: function() {
        this.application.setView('NP.view.images.SearchCDIndex');
    },

    /**
     * Search images.
     * Method requests data from the server and places it to the search result grid.
     */
    processButtonSearchCDIndexProcess: function() {
        var doctype = Ext.ComponentQuery.query(
            '[itemId~="field-image-doctype"]'
        )[0].getValue();
        var refnum  = Ext.ComponentQuery.query(
            '[itemId~="field-refnumber"]'
        )[0].getValue();

        var property_id  = Ext.ComponentQuery.query(
            '[itemId~="field-image-properties"]'
        )[0].getValue();
        var vendor_id  = Ext.ComponentQuery.query(
            '[itemId~="field-image-vendors"]'
        )[0].getValue();

        if (!doctype) {
            Ext.MessageBox.alert('Search Images', 'Please choose a document type.');
            return;
        }
        if (!refnum || refnum.length < 2) {
            Ext.MessageBox.alert('Search Images', 'Please enter at least 2 characters for reference number search.');
            return;
        }

        var result = Ext.ComponentQuery.query(
            '[itemId="grid-search-cdindex-results"]'
        )[0];

        var params = {};
        if (doctype) {
            params['doctype'] = doctype;
        }
        if (refnum) {
            params['refnumber'] = refnum;
        }
        if (property_id) {
            params['property_id'] = property_id;
        }
        if (vendor_id) {
            params['vendor_id'] = vendor_id;
        }
        result.store.load({params: params});

        var printButton =
            Ext.ComponentQuery.query('[itemId="buttonSearchCDIndexPrint"]')[0]
        ;
        printButton && printButton.show();
    },

    /**
     * Print Search CD Index Screen.
     */
    processButtonSearchCDIndexPrint: function() {
        window.print();
    },

    /***************************************************************************
     * View: Search Deleted
     **************************************************************************/
    /**
     * Show Search Deleted
     */
    showSearchDeleted: function() {
        this.application.setView('NP.view.images.SearchDeleted');
    },

    /**
     * Search deleted images.
     * Method requests data from the server and places it to the search result grid.
     */
    processButtonSearchDeletedProcess: function() {
        var vendor = Ext.ComponentQuery.query(
            '[itemId~="field-image-vendors"]'
        )[0].getValue();
        var invoice = Ext.ComponentQuery.query(
            '[itemId~="field-invoice-number"]'
        )[0].getValue();
        var deletedby = Ext.ComponentQuery.query(
            '[itemId~="field-deleted-by"]'
        )[0].getValue();

        if (!vendor) {
            Ext.MessageBox.alert('Search Deleted Images', 'Please choose a document type.');
            return;
        }

        var params = {};

        params['vendor'] = vendor;
        if (invoice) {
            params['invoice'] = invoice;
        }
        if (deletedby) {
            params['deletedby'] = deletedby;
        }

        var result = Ext.ComponentQuery.query(
            '[itemId="grid-search-deleted-results"]'
        )[0];
        result.store.load({params: params});
    },

    /***************************************************************************
     * View: Report
     **************************************************************************/
    /**
     * Show Report Screen.
     */
    showReport: function() {
        //this.application.setView('NP.view.images.Report');
        Ext.MessageBox.alert('Report', 'Coming soon');
    },

    /**
     * Generate Report.
     */
    processButtonGenerateReport: function() {
        Ext.MessageBox.alert('Generate Report', 'Coming soon');
    },

    /***************************************************************************
     * Common functions
     **************************************************************************/
    /**
     * Get current panel.
     * 
     * @return {} Main Screen Panel.
     */
    getCurrent: function() {
        var panel = 
            Ext.ComponentQuery.query('tabpanel')[0]
        ;
        return panel;
    },

    /**
     * Get current grid.
     * 
     * @return {} Main Screen Grid: "Images to be Indexed", "Invoices", "POs", "Exceptions" or "Deleted Images".
     */
    getCurrentGrid: function() {
        var panel = this.getCurrent();
        if (panel) {
            var current  = panel.getActiveTab();
            return current;
        }
    },

    /**
     * Get selection of the current grid.
     * 
     * @return [] List of selected identifiers.
     */
    getCurrentSelection: function() {
        var grid = this.getCurrentGrid();
        
        if (grid) {
            var selection = grid.getSelectionModel().getSelection();
            if (selection) {
                var identifiers = [];
                for (var i = 0, l = selection.length; i < l; i++) {
                    identifiers.push(selection[i].internalId);
                }
                if (identifiers.length > 0) {
                    return identifiers;
                }
            }
        }
    }
});