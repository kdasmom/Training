Ext.define('NP.controller.Images', {
    extend: 'NP.lib.core.AbstractController',

    init: function() {
        var control = {};

        this.controlMain(control);
        this.controlIndex(control);
        this.controlSearch(control);
        this.controlSearchCDIndex(control);

        this.control(control);
        this.enableBubble('tabchange');
    },

    controlMain: function(control) {
        var prefix = '[xtype="images.main"] ';

        control[prefix + '[xtype="tabpanel"]'] = {
            tabchange: this.processTabChange
        };
        control[prefix + 'tabpanel > grid'] = {
            itemclick: this.processCellClick
        }

        var self = this;
        control[prefix + '#imageManagementContextPicker'] = {
            change: function(toolbar, filterType, selected) {
                var contentView = this.application.getCurrentView();

                // If user picks a different property/region and we're on a register, update the grid
                if (contentView.getXType() == 'images.main') {
                    var grid = self.getCurrentGrid();
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
            }
        },

        control[prefix + 'button[itemId~="buttonUpload"]'] = {
            click: this.processButtonUpload
        };
        control[prefix + 'button[itemId~="buttonNPISS"]'] = {
            click: this.processButtonNPISS
        };
        control[prefix + 'button[itemId~="buttonNSISS"]'] = {
            click: this.processButtonNSISS
        };

        control[prefix + 'button[itemId~="buttonIndex"]'] = {
            click: this.processButtonIndex
        };
        control[prefix + 'button[itemId~="buttonDelete"]'] = {
            click: this.processButtonDelete
        }
        control[prefix + 'button[itemId~="buttonConvert"]'] = {
            click: function() {alert("THIS IS CORRECT PROCESSING");}
        }
        control[prefix + 'button[itemId~="buttonRevert"]'] = {
            click: this.processButtonRevert
        }
        control[prefix + 'button[itemId~="buttonDeletePermanently"]'] = {
            click: this.processButtonDeletePermanently
        }

        control[prefix + 'button[itemId~="buttonReport"]'] = {
            click: this.processButtonReport
        };
        control[prefix + 'button[itemId~="buttonSearch"]'] = {
            click: this.processButtonSearch
        };
    },

    /**
     * 
     */
    controlIndex: function(control) {
        var prefix = '[xtype="images.index"] ';

        control[prefix + 'button[itemId~="buttonReturn"]'] = {
            click: this.processButtonReturn
        };

        control[prefix + 'button[itemId~="buttonPrev"]'] = {
            click: this.processButtonPrev
        };
        control[prefix + 'button[itemId~="buttonNext"]'] = {
            click: this.processButtonNext
        };

        control[prefix + 'button[itemId~="buttonSaveAndNext"]'] = {
            click: this.processButtonSaveAndNext
        };
        control[prefix + 'button[itemId~="buttonSaveAndPrev"]'] = {
            click: this.processButtonSaveAndPrev
        };
        control[prefix + 'button[itemId~="buttonSaveAsException"]'] = {
            click: this.processButtonSaveAsException
        };

        control[prefix + 'button[itemId~="buttonSaveAndNextAction"]'] = {
            click: this.processButtonSaveAndNext
        };
        control[prefix + 'button[itemId~="buttonSaveAsExceptionAction"]'] = {
            click: this.processButtonSaveAsException
        };
        control[prefix + 'button[itemId~="buttonIndexingComplete"]'] = {
            click: this.processButtonIndexingComplete
        };
        
        control[prefix + 'button[itemId~="buttonInvoiceAction"]'] = {
            click: this.processButtonInvoice
        };

        control[prefix + 'button[itemId~="buttonInvoice"]'] = {
            click: this.processButtonInvoice
        };

        control[prefix + 'button[itemId~="buttonDeleteFromQueue"]'] = {
            click: this.processButtonDeleteFromQueue
        }
    },

    /**
     * 
     */
    controlSearch: function(control) {
        var prefix = '[xtype="images.search"] ';

        control[prefix + 'button[itemId~="buttonReturn"]'] = {
            click: this.processButtonReturn
        }
        
        control[prefix + 'button[itemId~="buttonSearchProcess"]'] = {
            click: this.processButtonSearchProcess
        }
        control[prefix + 'button[itemId~="buttonSearchCDIndex"]'] = {
            click: this.processButtonSearchCDIndex
        }
    },

    /**
     * 
     */
    controlSearchCDIndex: function(control) {
        var prefix = '[xtype="images.searchcdindex"] ';

        control[prefix + 'button[itemId~="buttonReturn"]'] = {
            click: this.processButtonReturn
        }
        
        control[prefix + 'button[itemId~="buttonSearchCDIndexProcess"]'] = {
            click: this.processButtonSearchCDIndexProcess
        }
        control[prefix + 'button[itemId~="buttonSearchCDIndexPrint"]'] = {
            click: this.processButtonSearchCDIndexPrint
        }
    },

    /**
     * 
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
     * 
     */
    showMain: function(tab) {
        this.application.setView('NP.view.images.Main');

        var panel = Ext.ComponentQuery.query('tabpanel')[0];
        var active = Ext.ComponentQuery.query('[itemId="images-' + (tab || 'index') + '"]')[0];

        if (active && active.getId() != panel.getActiveTab().getId()) {
            panel.setActiveTab(active);
        }

        var grid = this.getCurrentGrid();
        grid.store.reload();
    },

    /**
     *
     */
    processTabChange: function(tabPanel, newCard, oldCard, eOpts) {
        var grid = this.getCurrentGrid();
        var tabid = grid.getItemId().replace('images-', '').toLowerCase();

        this.application.addHistory('Images:showMain:' + tabid);

        grid.store.reload();
    },

    processCellClick: function(grid, record, item, index, event, eOpts) {
        if (event.getTarget().className != 'x-grid-row-checker') {
            window.open(
                '/ajax.php?service=ImageService&action=show&image_id=' + record.internalId,
                '_blank',
                'width=740, height=625, resizable=yes, scrollbars=yes'
            );
        }
    },

    /**
     *
     */
    processButtonIndex: function() {
        this.application.addHistory('Images:showIndex');
    },

    /**
     *
     */
    processButtonDelete: function() {
        var grid = this.getCurrentGrid();
        var selection = this.getCurrentSelection();

        if (selection) {
            NP.lib.core.Net.remoteCall({
                requests: {
                    service: 'ImageService',
                    action : 'delete',

                    identifiers: '[' + selection.join(',') + ']',

                    success: function(result) {
                        if (result.success) {
                            NP.Util.showFadingWindow({ html: 'Images Deleted' });
                            grid.store.reload();
                        }
                    }
                }
            });
        }
    },

    /**
     *
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
                            NP.Util.showFadingWindow({ html: 'Images Reverted' });
                            grid.store.reload();
                        }
                    }
                }
            });
        }
    },

    /**
     *
     */
    processButtonUpload: function() {
        Ext.create('NP.lib.ui.Uploader', {
            params: {
                form: {
                    action:  'save',
                    service: 'ImageService'
                }
            }
        }).show();
    },

    /**
     *
     */
    processButtonNPISS: function() {
        window.open('/resources/files/NexusBarcodeSeparator.pdf', 'BarCode_Window', 'width=740, height=625, resizable=yes, scrollbars=yes');
    },

    /**
     *
     */
    processButtonNSISS: function() {
        window.open('/resources/files/KofaxBarcode.pdf', 'BarCode_Window', 'width=740, height=625, resizable=yes, scrollbars=yes');
    },

    /**
     *
     */
    processButtonSearch: function() {
        this.application.addHistory('Images:showSearch');
    },

    /**
     *
     */
    processButtonReport: function() {
        this.application.addHistory('Images:showReport');
    },

    /**
     *
     */
    processButtonDeletePermanently: function() {
        var grid = this.getCurrentGrid();
        var selection = this.getCurrentSelection();

        if (selection) {
            NP.lib.core.Net.remoteCall({
                requests: {
                    service: 'ImageService',
                    action : 'delete',

                    identifiers: '[' + selection.join(',') + ']',
                    permanently: true,

                    success: function(result) {
                        if (result.success) {
                            NP.Util.showFadingWindow({ html: 'Images Deleted Permanently' });
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
    loadStoresBase: function(callback) {
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
    
    showIndex: function() {
        var grid = this.getCurrentGrid();
        var selection = this.getCurrentSelection();

        var section = 'index';
        if (grid) {
            if (grid.getXType() == 'images.grid.Exceptions') {
                section = 'exception';
            }
        }

            if (selection) {
                var items = [];
                for(var i = 0, l=selection.length; i<l; i++) {
                    items.push(selection[i]);
                }
                this.queueImages(items);


                var viewCfg = {
                    section: section,
                    bind: {
                        models: ['image.ImageIndex'],
                        service : 'ImageService',
                        action  : 'get',
                        extraParams: {
                            id: this.imageQueue[this.imageQueueCurrent],
                            filter: {
                                userprofile_id              : NP.Security.getUser().get('userprofile_id'),
                                delegated_to_userprofile_id : NP.Security.getDelegatedToUser().get('userprofile_id'),
                                contextType                 : 'all',// state && state[0] ? state[0].getState().type : '',
                                contextSelection            : ''//state && state[0] ? state[0].getState().selected : ''
                            }
                        }
                    },
                    listeners: {
                        dataloaded: function (form, data) {
                            if (data['utilityaccount_id']) {
                                var uproperty = Ext.ComponentQuery.query('[name="utility_property_id"]')[0];
                                uproperty && uproperty.setValue(data['Property_id']);

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
                            Ext.ComponentQuery.query('[name="Property_id"]')[0].setValue(data['Property_id']);
                            Ext.ComponentQuery.query('[name="property_id_alt"]')[0].setValue(data['Property_id']);

                            Ext.ComponentQuery.query('[name="invoiceimage_vendorsite_alt_id"]')[0].setValue(data['Image_Index_VendorSite_Id']);
                            Ext.ComponentQuery.query('[name="invoiceimage_vendorsite_id"]')[0].setValue(data['Image_Index_VendorSite_Id']);
                        }
                    }
                };

                var self = this;
                this.loadStoresBase(function(storeDoctypes, storeIntegrationPackages){
                    viewCfg['preload-store'] = {
                        doctype: storeDoctypes,
                        integrationPackage: storeIntegrationPackages
                    };

                    //ImageIndexForm
                    self.application.setView('NP.view.images.Index', viewCfg);

                    Ext.ComponentQuery.query('panel[id="panel-index"]')[0].setTitle('Image Index - ' + self.imageQueue[self.imageQueueCurrent]);
                    self.refreshIndex();
                })
        } else {
            this.processButtonReturn();
        }
    },
    updateIndex: function() {
        var form = 
            this.getCmp('images.index')
        ;

        var self = this;
        var mask = new Ext.LoadMask(form);

        mask.show();
        NP.lib.core.Net.remoteCall({
            requests: {
                service: form.bind.service,
		action : form.bind.action,

                id: this.imageQueue[this.imageQueueCurrent],
                filter: {
                    userprofile_id              : NP.Security.getUser().get('userprofile_id'),
                    delegated_to_userprofile_id : NP.Security.getDelegatedToUser().get('userprofile_id')//,
                    //contextType                 : 'all',// state && state[0] ? state[0].getState().type : '',
                    //contextSelection            : ''//state && state[0] ? state[0].getState().selected : ''
                },

                success: function(result, deferred) {
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

                    Ext.ComponentQuery.query('panel[id="panel-index"]')[0].setTitle('Image Index - ' + self.imageQueue[self.imageQueueCurrent]);
                    self.refreshIndex();

                    mask.destroy();
                }
            }
        });
    },
    refreshIndex: function() {
        var params = [
            'service=ImageService',
            'action=show',
            'image_id='
        ];
        Ext.getDom('iframe-panel').src = '/ajax.php?' + params.join('&') + this.imageQueue[this.imageQueueCurrent];
    },

    /**
     *
     */
    processButtonReturn: function() {
        this.application.addHistory('Images:showMain');
    },

    /**
     *
     */
    processButtonPrev: function() {
        if (this.imageQueueCurrent > 0) {
            this.imageQueueCurrent--;
            this.updateIndex();
        }
    },
    /**
     *
     */
    processButtonNext: function() {
        if (this.imageQueueCurrent < this.imageQueue.length - 1) {
            this.imageQueueCurrent++;
            this.updateIndex();
        }
    },

    saveImageIndex: function(action, section, callback) {
        var form = this.getCmp('images.index');

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
                    callback && callback();
                }
            });
        }
    },
    /**
     *
     */
    processButtonSaveAndNext: function() {
        this.saveImageIndex('index', 'index', this.processButtonNext);
    },
    /**
     *
     */
    processButtonSaveAndPrev: function() {
        this.saveImageIndex('index', 'index', this.processButtonPrev);
    },

    processButtonSaveAsException: function() {
        this.saveImageIndex('exception', 'index');
    },

    processButtonIndexingComplete: function() {
        this.saveImageIndex('complete', 'index');
    },

    /**
     *
     */
    processButtonInvoice: function() {
        this.application.addHistory('Invoice:showView');
    },

    imageQueue: [],
    imageQueueCurrent: 0,
    queueImages: function(images) {
        this.imageQueue = images;
        this.imageQueueCurrent = 0;
    },
    clearImages: function() {
        this.imageQueue = [];
        this.imageQueueCurrent = 0;
    },
    
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
                            NP.Util.showFadingWindow({ html: 'Images Deleted' });
                            self.application.setView('NP.view.images.Main');
                        }
                    }
                }
            });
        }
    },

    /***************************************************************************
     * View: Search
     **************************************************************************/
    /**
     *
     */
    showSearch: function() {
        this.application.setView('NP.view.images.Search');
    },

    /**
     *
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
            alert("Please enter an image name with more than 4 characters.");
            imagename.focus();
        } else if (searchtype.getValue() == 2 && scandate.getValue() == '') {
            alert("Please enter a scan date");
            scandate.focus();
        } else if (searchtype.getValue() == 3 && vendor.getValue().length < 4) {
            alert("Please enter a vendor with more than 4 characters.");
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
     *
     */
    processButtonSearchCDIndex: function() {
        this.application.addHistory('Images:showSearchCDIndex');
    },



    /***************************************************************************
     * View: Search CD Index
     **************************************************************************/
    /**
     *
     */
    showSearchCDIndex: function() {
        this.application.setView('NP.view.images.SearchCDIndex');
    },

    /**
     *
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
            alert('Please choose a document type.');
            return;
        }
        if (!refnum || refnum.length < 2) {
            alert('Please enter at least 2 characters for reference number search.');
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
    },

    /**
     *
     */
    processButtonSearchCDIndexPrint: function() {
        window.print();
    },



    /***************************************************************************
     * View: Report
     **************************************************************************/
    /**
     *
     */
    showReport: function() {
        this.application.setView('NP.view.images.Report');
    },

    processButtonGenerateReport: function() {
        alert('test');
    },



    /***************************************************************************
     * Common functions
     **************************************************************************/
    getCurrentGrid: function() {
        var panel = 
            Ext.ComponentQuery.query('tabpanel')[0]
        ;
        if (panel) {
            var current  = panel.getActiveTab();
            return current;
        }
    },
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