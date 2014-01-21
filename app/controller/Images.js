Ext.define('NP.controller.Images', {
    extend: 'NP.lib.core.AbstractController',

    stores: ['image.ImageDocTypes','vendor.UtilityAccounts','invoice.Invoices',
            'image.ImageToCDs'],
    models: ['vendor.UtilityAccount','image.ImageIndex'],
    views : ['image.Main','image.Index','image.Search'],

    requires: [
        'NP.lib.core.Util',
        'NP.lib.ui.Uploader',
        'NP.lib.core.SequenceTracker'
    ],

    init: function() {
        var control = {};

        this.controlMain(control);
        this.controlIndex(control);
        this.controlSearch(control);
        this.controlSearchCDIndex(control);

        this.control(control);
    },

    /**
     * Bind actions for Main Screen.
     */
    controlMain: function(control) {
        var prefix = '[xtype="image.main"] ';

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

        control[prefix + 'button[itemId~="buttonDeletePermanently"]'] = {
            click: this.processButtonDeletePermanently.bind(this)
        };
    },

    /**
     * Bind actions for Index Screen.
     */
    controlIndex: function(control) {
        var prefix = '[xtype="image.index"] ';

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

        control['#imageUseTemplateWin'] = {
            usetemplate   : this.onUseTemplate.bind(this),
            removetemplate: this.onUpdateTemplate.bind(this)
        }
    },

    /**
     * Bind actions for Search Screen.
     */
    controlSearch: function(control) {
        var prefix = '[xtype="image.search"] ';

        control[prefix + 'button[itemId~="buttonReturn"]'] = {
            click: this.processButtonReturn
        };
        control[prefix + 'button[itemId~="buttonSearchCDIndex"]'] = {
            click: this.processButtonSearchCDIndex
        };

        control[prefix + 'button[itemId~="buttonSearchProcessAction"]'] = {
            click: this.processButtonSearchProcess
        };

        control[prefix + '#grid-search-results'] = {
            itemclick: this.processCellClick
        };
    },

    /**
     * Bind actions for Search CD Index Screen.
     */
    controlSearchCDIndex: function(control) {
        var prefix = '[xtype="image.searchcdindex"] ';

        control[prefix + 'button[itemId~="buttonReturn"]'] = {
            click: this.processButtonReturn
        };
        
        control[prefix + 'button[itemId~="buttonSearchCDIndexPrint"]'] = {
            click: this.processButtonSearchCDIndexPrint
        };
        
        control[prefix + 'button[itemId~="buttonSearchCDIndexProcessAction"]'] = {
            click: this.processButtonSearchCDIndexProcess
        };
    },

    /**
     * Bind actions for Report Screen.
     */
    controlReport: function(control) {
        var prefix = '[xtype="image.report"] ';

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
            this.addHistory('Images:showSearch');
            return;
        };

        this.application.setView('NP.view.image.Main');

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

        var state = this.getCmp('shared.contextpicker').getState();

        current.store.addExtraParams({
            contextType     : state.type,
            contextSelection: state.selected
        });

        current.store.load();
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
            this.addHistory('Images:showMain:' + tabid);
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
                record.getImageLink(),
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
        if (contentView.getXType() == 'image.main') {
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
        var me        = this,
            selection = this.getCurrentSelection();

        if (selection.length) {
            me.imageTracker = Ext.create('NP.SequenceTracker', {
                name       : 'image_index_tracker',
                items      : selection,
                currentItem: selection[0]
            });

            me.addHistory('Images:showIndex');
        }
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
        var uploader = Ext.create('NP.lib.ui.Uploader', {
            params: {
                form: {
                    action:  'upload',
                    service: 'ImageService'
                },
                listeners: {
                    close: function() {
                        var grid = self.getCurrentGrid();
                        grid.store.reload();
                    },
                    onQueueComplete: function(uploads) {
                        NP.Util.showFadingWindow(
                            { html: 'Files uploaded successfully' }
                        );
                        uploader.close();
                    }
                }
            }
        });
        uploader.show();
    },

    /**
     * Open Nexus Payables Invoice Separator Sheet in a new window.
     */
    processButtonNPISS: function() {
        window.open('resources/files/NexusBarcodeSeparator.pdf', 'BarCode_Window', 'width=740, height=625, resizable=yes, scrollbars=yes');
    },

    /**
     * Open Nexus Services Invoice Separator Sheet in a new window.
     */
    processButtonNSISS: function() {
        window.open('resources/files/KofaxBarcode.pdf', 'BarCode_Window', 'width=740, height=625, resizable=yes, scrollbars=yes');
    },

    /**
     * Open Report Screen.
     */
    processButtonReport: function() {
        this.addHistory('Images:showReport');
    },

    /**
     * Open Search Screen.
     */
    processButtonSearch: function() {
        this.addHistory('Images:showSearch');
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
        // Find current section.
        var me      = this,
            section = 'index',
            grid    = this.getCurrentGrid();

        if (!me.imageTracker) {
            me.imageTracker = Ext.create('NP.SequenceTracker', {
                name : 'image_index_tracker'
            });

            if (!me.imageTracker.getItems().length) {
                me.addHistory('Images:showMain');
            }
        }

        me.current_image_index_id = me.imageTracker.getCurrentItem();

        if (grid) {
            if (grid.getXType() == 'image.grid.Exceptions') {
                section = 'exception';
            }
        }

        // Prepare view configuration.
        var viewCfg = {
            section: section,
            bind: {
                models: ['image.ImageIndex'],
                service : 'ImageService',
                action  : 'get',
                extraParams: {
                    image_index_id: me.current_image_index_id
                }
            },
            listeners: {
                dataloaded: function (form, data) {
                    me.setFieldsAfterLoad.apply(me, [data]);
                }
            }
        };

        // Preload stores.
        this.loadStores(function(storeDoctypes, storeIntegrationPackages){
            viewCfg['preload-store'] = {
                doctype: storeDoctypes,
                integrationPackage: storeIntegrationPackages
            };

            // Show Index Screen.
            me.setView('NP.view.image.Index', viewCfg, '#contentPanel', true);
            // Set correct url for iframe.
            me.refreshIndex();
        });
    },

    /**
     * After data for image index form is loaded, set correct values for some custom fields.
     * 
     * @param {} data Image index form data.
     */
    setFieldsAfterLoad: function(data) {
        var form     = this.getCmp('image.index'),
            buttons = ['buttonIndexingComplete','tbSep','buttonSaveAndPrev','buttonSaveAsException',
                        'buttonInvoice','buttonDeleteFromQueue'],
            btn, fn, i;

        for (i=0; i<buttons.length; i++) {
            btn = form.down('#' + buttons[i]);
            if (data['Image_Index_Status'] == 2) {
                fn = (buttons[i] == 'buttonIndexingComplete') ? 'show' : 'hide';
            } else {
                fn = (buttons[i] == 'buttonIndexingComplete') ? 'hide' : 'show';
            }
            btn[fn]();
        }

        // Initalize values in utility account fields if a utility account has been selected
        if (data['utilityaccount_id']) {
            var uaccountnumber = form.findField('UtilityAccount_AccountNumber'),
                umetersizes    = form.findField('UtilityAccount_MeterSize'),
                utilAccount    = form.findField('utilityaccount_id'),
                defaultAcct    = Ext.create('NP.model.vendor.UtilityAccount', Ext.apply(data, {
                    UtilityAccount_Id: data['utilityaccount_id']
                }));

            // If dealing with combos, we'll have to set default store records
            if (!NP.lib.core.Security.hasPermission(6095)) {
                uaccountnumber.setDefaultRec(defaultAcct);
                umetersizes.getStore().addExtraParams({
                    UtilityAccount_AccountNumber: defaultAcct.get('UtilityAccount_AccountNumber')
                });
                umetersizes.setDefaultRec(defaultAcct);
            }

            // Prepare the utility account combo
            utilAccount.getStore().addExtraParams({
                UtilityAccount_AccountNumber: defaultAcct.get('UtilityAccount_AccountNumber'),
                UtilityAccount_MeterSize    : defaultAcct.get('UtilityAccount_MeterSize')
            });

            utilAccount.setDefaultRec(defaultAcct);
        }

        var doctype = Ext.ComponentQuery.query('[name="Image_Doctype_Id"]')[0];
        if (!doctype.getValue()) {
            var doctypeValue = 
                form['preload-store'].doctype.totalCount && 
                form['preload-store'].doctype.getAt(0)
            ;
            doctype.setValue(doctypeValue);
        }
        form.onDocumentTypeChange(doctype, [doctype.findRecordByValue(doctype.getValue())]);

        if (data['vendor_name'] && data['vendor_id_alt']) {
            var record = Ext.create('NP.model.vendor.Vendor', Ext.apply({
                vendorsite_id: data['Image_Index_VendorSite_Id']
            }, data));

            var vname = Ext.ComponentQuery.query(
                '[name="Image_Index_VendorSite_Id"]'
            )[0];
            vname.setDefaultRec(record);
        }

        if (data['property_name'] && data['property_id_alt']) {
            record = Ext.create('NP.model.property.Property', Ext.apply({
                property_id: data['Property_Id']
            }, data));

            var pname = Ext.ComponentQuery.query(
                '[name="Property_Id"]'
            )[0];
            pname.setDefaultRec(record);
        }

        var poref = Ext.ComponentQuery.query('[name="po_ref"]')[0];
        if (poref && data['Image_Index_Ref']) {
            poref.setValue(data['Image_Index_Ref']);
        }

        // Update the Use Template button to reflect correct state
        this.setTemplateButtonText(data['image_index_draft_invoice_id']);

        // Set Correct title.
        form.setTitle('Image Index - ' + data['Image_Index_Name']);
    },

    /**
     * Preload necessary stores.
     * Before Index screen will be displayed all necessary stores for comboboxes should be loaded.
     * 
     * @param Function callback Method will be called after all necessary stores be loaded.
     */
    loadStores: function(callback) {
        var storeDoctypes = 
            Ext.create('NP.store.image.ImageDocTypes',{
                service: 'ImageService',
                action : 'getDocTypes'
            }
        );
        var storeIntegrationPackages =
            Ext.create('NP.store.system.IntegrationPackages', {
                service : 'ConfigService',
                action  : 'getIntegrationPackages'
            }
        );

        storeDoctypes.load(function(records, operation, success) {
            storeIntegrationPackages.load(function(records, operation, success) {
                callback && callback(storeDoctypes, storeIntegrationPackages);
            });
        });
    },

    /**
     * Load appropriate image to the iframe.
     */
    refreshIndex: function() {
        Ext.getDom('iframe-panel').src = NP.model.image.ImageIndex.getImageLink(this.current_image_index_id);
    },

    onUseTemplate: function(win, invoice_id) {
        var me         = this,
            invoice_id = win.down('[name="invoice_id"]').getValue();

        me.onUpdateTemplate(win, invoice_id);
    },

    onUpdateTemplate: function(win, invoice_id) {
        var me         = this,
            form       = me.getCmp('image.index');

        invoice_id = invoice_id || '';

        form.findField('image_index_draft_invoice_id').setValue(invoice_id);
        me.setTemplateButtonText(invoice_id);
        win.close();
    },

    setTemplateButtonText: function(invoice_id) {
        var me         = this,
            form       = me.getCmp('image.index'),
            button     = form.down('#field-use-template'),
            buttonText;

        if (invoice_id == '' || invoice_id === null) {
            buttonText = NP.Translator.translate('Use Template');
        } else {
            buttonText = NP.Translator.translate('View Selected Template');
        }

        button.setText(buttonText);
    },

    /**
     * Open Previous Image from Queue in the Index Image Form.
     * If this method is called after image is saved then such image should be removed from the queue.
     */
    processButtonPrev: function(remove) {
        var me = this;

        remove = (arguments.length) ? remove : false;

        me.moveToImage('previous', remove);
    },

    moveToImage: function(direction, remove) {
        var me   = this,
            image_index_id;

        image_index_id = me.imageTracker[direction]();

        if (remove === true) {
            me.imageTracker.removeItem(me.current_image_index_id);
        }

        if (image_index_id === null) {
            me.processButtonReturn();
        } else {
            me.current_image_index_id = image_index_id;
            me.showIndex();
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
        this.addHistory('Images:showMain');
    },

    /**
     * Delete Image from Index Image Screen.
     */
    processButtonDeleteFromQueue: function() {
        var me = this;

        NP.lib.core.Net.remoteCall({
            requests: {
                service                    : 'ImageService',
                action                     : 'delete',
                
                identifiers                : '[' + me.imageTracker.getCurrentItem() + ']',
                userprofile_id             : NP.Security.getUser().get('userprofile_id'),
                delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),

                success                    : function(result) {
                    if (result.success) {
                        NP.Util.showFadingWindow({
                            html: 'Images Deleted'
                        });
                        me.addHistory('Images:showMain');
                    }
                }
            }
        });
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
        var me = this;

        remove = (arguments.length) ? remove : false;

        me.moveToImage('next', remove);
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
        var form = this.getCmp('image.index');
        
        if (form.isValid(action)) {
            form.submitWithBindings({
                action: 'update',
                service: 'ImageService',
                extraParams: {
                    params: {
                        action                     : action,// || exception || index complete
                        section                    : section,//|| exception
                        userprofile_id             : NP.Security.getUser().get('userprofile_id'),
                        delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id')
                    }
                },
                success: function(result) {
                    callback && callback(true);
                }
            });
        }
    },

    /***************************************************************************
     * View: Search
     **************************************************************************/
    /**
     * Show Search Screen
     */
    showSearch: function() {
        this.application.setView('NP.view.image.Search');
    },

    /**
     * Search images.
     * Method requests data from the server and places it to the search result grid.
     */
    processButtonSearchProcess: function() {
        var searchtype = Ext.ComponentQuery.query('#field-image-searchtype')[0],
            imagename  = Ext.ComponentQuery.query('#field-image-name')[0],
            scandate   = Ext.ComponentQuery.query('#field-scan-date')[0],
            vendor     = Ext.ComponentQuery.query('#field-vendor')[0];

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

            var result        = Ext.ComponentQuery.query('#grid-search-results')[0],
                doctype       = Ext.ComponentQuery.query('#field-image-doctype')[0],
                contextpicker = this.getCmp('shared.contextpickermulti');

            var params = {
                doctype         : doctype.getValue(),
                searchtype      : searchtype.getValue(),
                searchstring    : searchstring,

                contextType     : contextpicker.getState().type,
                contextSelection: contextpicker.getState().selected
            }

            if (params.contextSelection && params.contextSelection.join) {
                params.contextSelection = params.contextSelection.join(',');
            }

            result.show();
            result.store.load({params: params});
        }
    },

    /**
     * Open Search CD Index Screen
     */
    processButtonSearchCDIndex: function() {
        this.addHistory('Images:showSearchCDIndex');
    },

    /***************************************************************************
     * View: Search CD Index
     **************************************************************************/
    /**
     * Show Search CD Index Screen
     */
    showSearchCDIndex: function() {
        this.application.setView('NP.view.image.SearchCDIndex');
    },

    /**
     * Search images.
     * Method requests data from the server and places it to the search result grid.
     */
    processButtonSearchCDIndexProcess: function() {
        var me          = this,
            form        = me.getCmp('image.searchcdindex'),
            doctype     = form.down('#field-image-doctype').getValue(),
            refnum      = form.down('#field-refnumber').getValue(),
            property_id = form.down('#field-image-properties').getValue(),
            vendor_id   = form.down('#field-image-vendors').getValue(),
            resultStore = form.down('#grid-search-cdindex-results').getStore();

        if (!doctype) {
            Ext.MessageBox.alert('Search Images', 'Please choose a document type.');
            return;
        }
        if (!refnum || refnum.length < 2) {
            Ext.MessageBox.alert('Search Images', 'Please enter at least 2 characters for reference number search.');
            return;
        }

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

        resultStore.addExtraParams(params).load();

        form.down('#buttonSearchCDIndexPrint').show();
    },

    /**
     * Print Search CD Index Screen.
     */
    processButtonSearchCDIndexPrint: function() {
        Ext.MessageBox.alert('Print', 'Coming soon...');
    },

    /***************************************************************************
     * View: Report
     **************************************************************************/
    /**
     * Show Report Screen.
     */
    showReport: function() {
        //this.application.setView('NP.view.image.Report');
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
                return NP.Util.valueList(selection, 'Image_Index_Id');
            }
        }

        return [];
    }
});