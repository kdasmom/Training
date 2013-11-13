Ext.define('NP.controller.Images', {
    extend: 'NP.lib.core.AbstractController',
    //stores: 'Images',

    init: function() {
        var control = {};

        this.controlMain(control);
        this.controlIndex(control);
        this.controlSearch(control);

        this.control(control);
    },
    controlMain: function(control) {
        var prefix = '[xtype="images.main"] ';

        control[prefix] = {
            tabchange: function(tabPanel, newCard, oldCard, eOpts) {
                this.application.addHistory('Images:showMain:' + newCard.getId().replace('images-', '').toLowerCase());
            }
        };

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
            click: function() {alert("THIS IS CORRECT PROCESSING");}
        }
        control[prefix + 'button[itemId~="buttonDeletePermanently"]'] = {
            click: function() {alert("THIS IS CORRECT PROCESSING");}
        }

        control[prefix + 'button[itemId~="buttonReport"]'] = {
            click: function() {alert("THIS IS CORRECT PROCESSING");}
        };
        control[prefix + 'button[itemId~="buttonSearch"]'] = {
            click: this.processButtonSearch
        };
    },
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
    },
    controlSearch: function(control) {
        var prefix = '[xtype="images.search"] ';

        control[prefix + 'button[itemId~="buttonReturn"]'] = {
            click: this.processButtonReturn
        }
    },

    processButtonUpload: function() {
        Ext.create('NP.lib.ui.Uploader', {
            params: {
                form: {
                    action:  'save',
                    service: 'ImageService'
                }
            }
        }).show();
        
/*
			<cfif 
                            IsDefined("request.invoice_id") OR 
                            IsDefined("request.VendorEst_id") OR 
                            isDefined("request.receipt_id") OR  
                           isDefined("request.purchaseorder_id") OR 
                            isDefined("request.Vendorsite_ID")>
				,property_id:		'#request.property_id#',
				vendorsite_id:		'#request.vendorsite_id#'
			</cfif>
			<cfif IsDefined("request.invoice_id")>
				,invoice_id:			'#request.invoice_id#',
				invoiceimage_date:	'#DateFormat(request.invoiceimage_date, "mm/dd/yyyy")#',
				invoiceimage_amount:'#request.invoiceimage_amount#'
			<cfelseif IsDefined("request.VendorEst_id")>
				,VendorEst_id:		'#request.VendorEst_id#'
			<cfelseif isDefined("request.receipt_id")>
				,table_name:			'receipt',
				tablekey_id:		'#request.receipt_id#',
				invoiceimage_ref:	'#request.receipt_ref#',
				doc_datetm:			'#request.receipt_datetm#'
			<cfelseif isDefined("request.purchaseorder_id")>
				,table_name:			'purchaseorder',
				tablekey_id:		'#request.purchaseorder_id#',
				invoiceimage_ref:	'#request.purchaseorder_ref#',
				doc_datetm:			'#request.purchaseorder_datetm#'
			<cfelseif isDefined("request.Vendorsite_ID")>
				,image_tableref_id:	'#request.image_tableref_id#'
			</cfif>

 */
    },
    processButtonNPISS: function() {
        window.open('/resources/files/NexusBarcodeSeparator.pdf', 'BarCode_Window', 'width=740, height=625, resizable=yes, scrollbars=yes');
    },
    processButtonNSISS: function() {
        window.open('/resources/files/KofaxBarcode.pdf', 'BarCode_Window', 'width=740, height=625, resizable=yes, scrollbars=yes');
    },

    processButtonIndex: function() {
        this.application.addHistory('Images:showIndex');
    },
    processButtonDelete: function() {
        var grid = Ext.ComponentQuery.query('[xtype="images.grid.Index"]')[0];
        
        if (grid) {
            var selection = grid.getSelectionModel().getSelection();
            if (selection) {
                var identifiers = [];
                for (var i = 0, l = selection.length; i < l; i++) {
                    identifiers.push(selection[i].internalId);
                }
                if (identifiers.length > 0) {
                    identifiers = '[' + identifiers.join(',') + ']';

                    NP.lib.core.Net.remoteCall({
                        requests: {
                            service: 'ImageService',
                            action : 'delete',

                            identifiers: identifiers,

                            success: function(result) {
                                if (result.success) {
                                    // Show info message
                                    NP.Util.showFadingWindow({ html: 'Images Deleted' });
                                    Ext.ComponentQuery.query('[xtype="images.grid.Index"]')[0].store.reload();
                                }
                            }
                        }
                    });

                }
            }
        }
    },

    processButtonSearch: function() {
        this.application.addHistory('Images:showSearch');
    },

    processButtonReturn: function() {
        this.application.addHistory('Images:showMain');
    },

    processButtonPrev: function() {
        this.indexPrevImage();
    },
    processButtonNext: function() {
        this.indexNextImage();
    },

    processButtonSaveAndNext: function() {
        //var form = Ext.ComponentQuery.query('[id~="index-form"]')[0].getForm();
        var form = this.getCmp('images.index');
console.dir(form.getValues());

        form.submitWithBindings({
            action: 'update',
            service: 'ImageService',
            extraParams: {
                params: {
                    section: 'index',
                    userprofile_id              : NP.Security.getUser().get('userprofile_id'),
                    delegated_to_userprofile_id : NP.Security.getDelegatedToUser().get('userprofile_id')

//                    contextType                 : 'all',// state && state[0] ? state[0].getState().type : '',
//                    contextSelection            : ''//state && state[0] ? state[0].getState().selected : ''
                }
            },

            success: function(result) {
                
            }
        });
        /*var values = form.getValues();
        values['action'] = 'indexImages';
        values['service'] = 'ImageService';
        
        Ext.Ajax.request({
            url: '/ajax.php',
            method: 'POST',
            params: values,
            success: function() {
                console.dir('success');
            },
            failure: function() {
                console.dir('failure');
            }
        });*/
    },

    showMain: function(tab) {
        this.application.setView('NP.view.images.Main');

        var panel = Ext.ComponentQuery.query('tabpanel')[0];
        var active = Ext.ComponentQuery.query('#images-' + (tab || 'index'))[0];

        if (active.getId() != panel.getActiveTab().getId()) {
            panel.setActiveTab(active);
        }
        //Ext.ComponentQuery.query('[xtype="image.imagegrid"]')[0].store.reload();
        Ext.ComponentQuery.query('[xtype="images.grid.Index"]')[0].store.reload();
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
    indexPrevImage: function() {
                var viewCfg = {
                    bind: {
                        models: ['image.ImageIndex'],
                        service : 'ImageService',
                        action  : 'getImageToIndex',
                        extraParams: {
                            id: this.imageQueue[this.imageQueueCurrent]
                        }
                    },
                    listeners: {
                        dataloaded: function () {
                            
                            console.dir('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                        }
                    }
                };
                this.application.setView('NP.view.images.Index', viewCfg);
        
        if (this.imageQueueCurrent > 0)
            this.imageQueueCurrent--;
        Ext.ComponentQuery.query('panel[id="panel-index"]')[0].setTitle('Image Index - ' + this.imageQueue[this.imageQueueCurrent]);
        this.indexRefreshImage();
    },
    indexNextImage: function() {
                var viewCfg = {
                    bind: {
                        models: ['image.ImageIndex'],
                        service : 'ImageService',
                        action  : 'getImageToIndex',
                        extraParams: {
                            id: this.imageQueue[this.imageQueueCurrent]
                        }
                    },
                    listeners: {
                        dataloaded: function () {
                            
                            console.dir('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                        }
                    }
                };
                this.application.setView('NP.view.images.Index', viewCfg);
        
        if (this.imageQueueCurrent < this.imageQueue.length - 1)
            this.imageQueueCurrent++;
        Ext.ComponentQuery.query('panel[id="panel-index"]')[0].setTitle('Image Index - ' + this.imageQueue[this.imageQueueCurrent]);
        this.indexRefreshImage();
    },
    indexRefreshImage: function() {
        var params = [
            'service=ImageService',
            'action=show',
            'image_id='
        ];
        Ext.getDom('iframe-panel').src = '/ajax.php?' + params.join('&') + this.imageQueue[this.imageQueueCurrent];
    },

    showIndex: function() {
        //var grid = Ext.ComponentQuery.query('[xtype="images.grid.Index"]')[0];
        var grid = Ext.ComponentQuery.query('[xtype="images.grid.Index"]')[0];
        
        if (grid) {
            var selection = grid.getSelectionModel().getSelection();
            if (selection) {
                var items = [];
                Ext.Array.each(selection, function(item){
                    items.push(item.getId());
                });
                this.queueImages(items);


                var viewCfg = {
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
                        dataloaded: function () {
                            
                            console.dir('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                        }
                    }
                };
                this.application.setView('NP.view.images.Index', viewCfg);
                Ext.ComponentQuery.query('panel[id="panel-index"]')[0].setTitle('Image Index - ' + this.imageQueue[this.imageQueueCurrent]);
                this.indexRefreshImage();

          /*      this.application.setView('NP.view.images.Index', viewCfg);

                Ext.ComponentQuery.query('panel[id="panel-index"]')[0].setTitle('Image Index - ' + this.imageQueue[this.imageQueueCurrent]);

                this.indexRefreshImage();
        
        Ext.ComponentQuery.query('[xtype="form"]')[0].getForm().setValues({
            'field-doctype': 1
        });
        */
                /*var params = [
                    'service=ImageService',
                    'action=show',
                    'image_id='
                ];
                Ext.getDom('iframe-panel').src = '/ajax.php?' + params.join('&') + this.imageQueue[this.imageQueueCurrent];

/*                var target = Ext.ComponentQuery.query('[itemId~="tExperiment"]')[0];
                target.setTitle(this.itemsToIndex.join(" === "));*/
            }
        } else {
            this.processButtonReturn();
        }
    },
    showSearch: function() {
        this.application.setView('NP.view.images.Search');
    }
});