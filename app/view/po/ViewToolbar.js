/**
 * The toolbar for the PO view page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.ViewToolbar', {
    extend: 'NP.view.shared.PermissionToolbar',
    alias: 'widget.po.viewtoolbar',

    requires: [
        'NP.lib.core.Security',
        'NP.lib.core.Translator',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Process',
        'NP.view.shared.button.Save',
        'NP.view.shared.button.Delete',
        'NP.view.shared.button.Hourglass',
        'NP.view.shared.button.Upload',
        'NP.view.shared.button.New',
        'NP.view.shared.button.Edit'
    ],

    // For localization
    
    initComponent: function() {
        var me = this;

        me.items = [
            {
                xtype: 'shared.button.cancel'
            },{
                itemId          : 'poSaveBtn',
                xtype           : 'shared.button.save',
                displayCondition: me.isSaveBtnVisible
            },{
                text            : NP.Translator.translate('Approve'),
                itemId          : 'poApproveBtn',
                iconCls         : 'approve-btn',
                moduleId        : 1026,
                displayCondition: me.isApproveBtnVisible.bind(me)
            },{
                text            : NP.Translator.translate('Approve and Next'),
                itemId          : 'poApproveAndNextBtn',
                iconCls         : 'approve-next-btn',
                moduleId        : 1026,
                displayCondition: me.isApproveBtnVisible.bind(me)
            },{
                text            : NP.Translator.translate('Reject'),
                itemId          : 'poRejectBtn',
                iconCls         : 'reject-btn',
                displayCondition: me.isRejectBtnVisible.bind(me)
            },{
                xtype           : 'shared.button.process',
                text            : NP.Translator.translate('Ready For Processing'),
                itemId          : 'poReadyForProcessingBtn',
                moduleId        : 1027,
                displayCondition: me.isReadyBtnVisible.bind(me)
            },{
                text            : NP.Translator.translate('Release'),
                itemId          : 'releaseBtn',
                iconCls         : 'release-btn',
                displayCondition: me.isReleaseBtnVisible.bind(me)
            },{
                text            : NP.Translator.translate('Process Invoice'),
                itemId          : 'processInvoiceBtn',
                iconCls         : 'process-btn',
                displayCondition: me.isProcessBtnVisible.bind(me)
            },{
                text            : NP.Translator.translate('Final Review'),
                itemId          : 'finalReviewBtn',
                iconCls         : 'final-review-btn',
                moduleId        : 6029,
                displayCondition: me.isFinalReviewBtnVisible.bind(me)
            },{
                text            : NP.Translator.translate('Mark Items as Received'),
                itemId          : 'markAsReceivedBtn',
                iconCls         : 'mark-received-btn',
                moduleId        : 6023,
                displayCondition: me.isMarkReceivedBtnVisible.bind(me)
            },{
                xtype           : 'shared.button.edit',
                text            : NP.Translator.translate('Modify'),
                itemId          : 'poModifyBtn',
                displayCondition: me.isModifyBtnVisible.bind(me)
            },{
                xtype           : 'shared.button.edit',
                text            : NP.Translator.translate('Modify Header Custom Fields'),
                itemId          : 'poModifyHeaderCustomBtn',
                displayCondition: me.isModifyHeaderCustomBtnVisible.bind(me)
            },{
                text            : 'Cancel PO',
                itemId          : 'poCancelBtn',
                iconCls         : 'void-btn',
                moduleId        : 6089,
                displayCondition: me.isCancelBtnVisible.bind(me)
            },{
                xtype           : 'shared.button.delete',
                itemId          : 'poDeleteBtn',
                displayCondition: me.isDeleteBtnVisible.bind(me)
            },{
                text            : NP.Translator.translate('Approve and Route Manually'),
                itemId          : 'poApproveAndRouteBtn',
                iconCls         : 'route-btn',
                moduleId        : 1026,
                displayCondition: me.isRouteBtnVisible.bind(me)
            },{
                text            : NP.Translator.translate('Pass and Route Manually'),
                itemId          : 'poPassAndRouteBtn',
                iconCls         : 'route-btn',
                moduleId        : 6003,
                displayCondition: me.isRouteBtnVisible.bind(me)
            },{
                text            : NP.Translator.translate('Route Manually'),
                iconCls         : 'route-btn',
                displayCondition: me.isRouteManuallyBtnVisible.bind(me)
            },{
                text            : NP.Translator.translate('Apply Template'),
                itemId          : 'poApplyTemplateBtn',
                iconCls         : 'template-apply-btn',
                displayCondition: me.isApplyTemplateBtnVisible
            },{
                text            : NP.Translator.translate('Use Template'),
                itemId          : 'poUseTemplateBtn',
                iconCls         : 'template-apply-btn',
                displayCondition: me.isUseTemplateBtnVisible
            },{
                text            : NP.Translator.translate('Create Copy'),
                itemId          : 'poCreateCopy',
                iconCls         : 'copy-btn',
                moduleId        : 2007,
                displayCondition: me.isCopyBtnVisible
            },{
                text            : NP.Translator.translate('Create Schedule'),
                itemId          : 'poCreateSchedule',
                iconCls         : 'schedule-btn',
                moduleId        : 2017,
                displayCondition: me.isScheduleBtnVisible
            },{
                text            : NP.Translator.translate('Modify Schedule'),
                itemId          : 'poModifySchedule',
                iconCls         : 'schedule-btn',
                moduleId        : 2017,
                displayCondition: me.isModifyScheduleBtnVisible
            },{
                text            : NP.Translator.translate('Manage Images'),
                itemId          : 'poImageManageBtn',
                iconCls         : 'image-manage-btn',
                displayCondition: me.isManageImagesBtnVisible
            },{
                text            : NP.Translator.translate('Forward to Vendor'),
                itemId          : 'poForwardToVendorBtn',
                iconCls         : 'message-btn',
                componentCls    : 'message-comp-btn',
                moduleId        : 2024,
                displayCondition: me.isForwardVendorBtnVisible
            },{
                text            : NP.Translator.translate('Forward PO'),
                itemId          : 'poForwardBtn',
                iconCls         : 'message-btn',
                componentCls    : 'message-comp-btn',
                moduleId        : 2025,
                displayCondition: me.isForwardBtnVisible
            },{
                text            : NP.Translator.translate('Browse Catalog'),
                itemId          : 'browseCatalogBtn',
                iconCls         : 'update-btn',
                moduleId        : 6067,
                displayCondition: me.isBrowseCatalogBtnVisible
            },{
                xtype: 'tbseparator',
                displayCondition: me.isMenuVisible
            },{
                text    : 'Actions',
                defaults: { hidden: false },
                displayCondition: me.isMenuVisible,
                menu    : [
                    {
                        text            : NP.Translator.translate('Change Property'),
                        itemId          : 'poChangePropertyBtn',
                        iconCls         : 'property-btn',
                        moduleId        : 6011,
                        displayCondition: me.isChangePropertyBtnVisible.bind(me)
                    },{
                        text            : NP.Translator.translate('Print'),
                        itemId          : 'poPrintBtn',
                        iconCls         : 'print-btn',
                        displayCondition: me.isPrintBtnVisible
                    },{
                        text            : NP.Translator.translate('Budget Report'),
                        iconCls         : 'report-btn',
                        moduleId        : 1039,
                        displayCondition: me.isBudgetReportBtnVisible
                    },{
                        text            : NP.Translator.translate('Save as Template'),
                        itemId          : 'poSaveTemplateBtn',
                        iconCls         : 'template-save-btn',
                        moduleId        : 2007,
                        displayCondition: me.isSaveTemplateBtnVisible
                    },{
                        text            : NP.Translator.translate('Save as User Template'),
                        itemId          : 'poSaveUserTemplateBtn',
                        iconCls         : 'template-save-user-btn',
                        moduleId        : 2005,
                        displayCondition: me.isSaveTemplateBtnVisible
                    },{
                        text            : NP.Translator.translate('Auto Submit to Vendor'),
                        itemId          : 'poAutoSubmitBtn',
                        iconCls         : 'submit-btn',
                        moduleId        : 2024,
                        displayCondition: me.isAutoSubmitBtnVisible
                    }
                ]
            },
            {
                xtype: 'tbseparator',
                displayCondition: me.isMenuVisible
            },
            {
                text    : 'Images',
                defaults: { hidden: false },
                displayCondition: me.isMenuVisible,
                menu    : [
                    {
                        text            : NP.Translator.translate('Upload Image'),
                        itemId          : 'poImageUploadBtn',
                        iconCls         : 'upload-btn',
                        moduleId        : 2087,
                        displayCondition: me.isUploadImageBtnVisible
                    },
                    {
                        text            : NP.Translator.translate('View Image'),
                        itemId          : 'poImageViewBtn',
                        iconCls         : 'image-view-btn',
                        displayCondition: me.isManageImagesBtnVisible
                    },
                    {
                        text            : NP.Translator.translate('Add Image'),
                        itemId          : 'poImageAddBtn',
                        iconCls         : 'image-add-btn',
                        moduleId        : 2087,
                        displayCondition: me.isAddImageBtnVisible
                    }
                ]
            }
        ];

    	this.callParent(arguments);
    },

    isSaveBtnVisible: function(data) {
        var po_status = data['purchaseorder'].get('purchaseorder_status');

        return (
            (
                (
                    po_status == 'open'
                    && (
                        NP.Security.hasPermission(1027)     // New PO permission
                        || NP.Security.hasPermission(6074)  // Modify Any permission
                        || NP.Security.hasPermission(6075)  // Modify Only Created permission
                    )
                ) || (
                    po_status == 'saved'
                    && NP.Security.hasPermission(6011)      // PO Post Approval Modify permission
                )
                && NP.Config.getSetting('PN.InvoiceOptions.SkipSave', '0') == '0'
            ) || (
                po_status == 'forapproval'
                && data['is_approver'] === true
                && NP.Security.hasPermission(1026)          // Purchase Orders permission
            ) || (
                po_status == 'draft'
                && NP.Security.hasPermission(2007)          // PO Templates permission
            )
        );
    },

    deferUntilLinesLoaded: function(callback) {
        var me    = this,
            tries = 0;

        // We need a function we can defer and recall in case we need to
        // wait for some views to render or stores to load
        function showBtn() {
            tries++;
            var lineView = Ext.ComponentQuery.query('[xtype="shared.invoicepo.viewlines"] dataview');

            // If views aren't ready or stores haven't loaded, defer the process
            if (!lineView.length || !lineView[0].getStore().isLoaded
            ) {
                // Put a limit on the number of times setTimeout can run just so it doesn't run forever
                if (tries < 50) {
                    Ext.defer(showBtn, 1000);
                }
                return false;
            }

            return callback();
        }

        return showBtn();
    },

    hasReceivedLines: function() {
        var lineView         = Ext.ComponentQuery.query('[xtype="shared.invoicepo.viewlines"] dataview')[0],
            lineStore        = lineView.getStore(),
            hasReceivedLines = false;

        lineStore.each(function(rec) {
            if (rec.get('poitem_isReceived') == 1 && !Ext.isEmpty(rec.get('rctitem_status'))) {
                hasReceivedLines = true;
                return false;
            }
        });

        return hasReceivedLines;
    },

    hasUnlinkedLines: function() {
        var lineView         = Ext.ComponentQuery.query('[xtype="shared.invoicepo.viewlines"] dataview')[0],
            lineStore        = lineView.getStore(),
            hasUnlinkedLines = false;

        lineStore.each(function(rec) {
            if (
                Ext.isEmpty(rec.get('reftable_name')) 
                && Ext.isEmpty(rec.get('reftablekey_id')) 
            ) {
                hasUnlinkedLines = true;
                return false;
            }
        });

        return hasUnlinkedLines;
    },

    hasReceivableLines: function() {
        var lineView         = Ext.ComponentQuery.query('[xtype="shared.invoicepo.viewlines"] dataview')[0],
            lineStore        = lineView.getStore(),
            hasReceivableLines = false;

        lineStore.each(function(rec) {
            if (
                Ext.isEmpty(rec.get('reftable_name')) 
                && Ext.isEmpty(rec.get('reftablekey_id'))
                && rec.get('poitem_isReceived') !== 1
            ) {
                hasReceivableLines = true;
                return false;
            }
        });

        return hasReceivableLines;
    },

    hasLinkedLines: function() {
        var lineView         = Ext.ComponentQuery.query('[xtype="shared.invoicepo.viewlines"] dataview')[0],
            lineStore        = lineView.getStore(),
            hasLinkedLines   = false;

        lineStore.each(function(rec) {
            if (
                rec.get('reftable_name') == 'invoiceitem'
                && rec.get('reftablekey_id') !== null
                && rec.get('reftablekey_id') !== 0
            ) {
                hasLinkedLines = true;
                return false;
            }
        });

        return hasLinkedLines;
    },

    isCancelBtnVisible: function(data) {
        var me = this;

        return me.deferUntilLinesLoaded(function() {
            var btn   = Ext.ComponentQuery.query('#poCancelBtn')[0];

            if (
                data['purchaseorder'].get('purchaseorder_status') == 'saved'
                && me.hasUnlinkedLines()
            ) {
                btn.show();
                return true;
            } else {
                btn.hide();
                return false;
            }
        });
    },

    isDeleteBtnVisible: function(data) {
        var me = this;

        if (data['purchaseorder'].get('purchaseorder_id') === null) {
            return false;
        }

        return me.deferUntilLinesLoaded(function() {
            var btn       = Ext.ComponentQuery.query('#poDeleteBtn')[0],
                po_status = data['purchaseorder'].get('purchaseorder_status');

            if (
                Ext.Array.contains(['saved','open','rejected','draft'], po_status)
                && (
                    data['purchaseorder'].get('userprofile_id') == NP.Security.getUser().get('userprofile_id')
                    || NP.Security.hasPermission(2043)
                )
                && !me.hasLinkedLines()
                && !me.hasReceivedLines()
            ) {
                btn.show();
                return true;
            } else {
                btn.hide();
                return false;
            }
        });
    },

    isApplyTemplateBtnVisible: function(data) {
        return (
            data['purchaseorder'].get('purchaseorder_id') !== null &&
            data['purchaseorder'].get('purchaseorder_status') == 'open'
            && (
                NP.Security.hasPermission(2005)     // PO User Templates permission
                || NP.Security.hasPermission(2007)  // PO Templates permission
            )
        );
    },

    isUseTemplateBtnVisible: function(data) {
        return (
            data['purchaseorder'].get('purchaseorder_status') == 'draft'
            && data['property_status'] != -1     // Property is not on hold
            && (
                NP.Security.hasPermission(2005)     // PO User Templates permission
                || NP.Security.hasPermission(2007)  // PO Templates permission
            )
        );
    },

    isApproveBtnVisible: function(data) {
        var me = this;
        return (
            me.isRejectBtnVisible(data)
            && NP.Security.hasPermission(1026)      // PO permission
            && NP.Config.getSetting('pn.jobcosting.jobcostingEnabled', '0') == '1'
            && data['inactive_contracts'].length == 0
            && data['inactive_jobs'].length == 0
        );
    },

    isRejectBtnVisible: function(data) {
        return (
            this._isVendorValid(data)
            && data['purchaseorder'].get('purchaseorder_status') == 'forapproval'
            && data['is_approver']
        );
    },

    isMenuVisible: function(data) {
        return (data['purchaseorder'].get('purchaseorder_id') !== null);
    },

    isManageImagesBtnVisible: function(data) {
        return (data['image'] !== null);
    },

    isChangePropertyBtnVisible: function(data) {
        var me = this;

        return me.deferUntilLinesLoaded(function() {
            var btn    = Ext.ComponentQuery.query('#poChangePropertyBtn')[0],
                status = data['purchaseorder'].get('purchaseorder_status');
            
            if (
                data['purchaseorder'].get('purchaseorder_id') !== null
                && (
                    status == 'draft'
                    || (
                        status == 'saved' 
                        && !me.hasLinkedLines()
                    )
                )
            ) {
                btn.show();
                return true;
            } else {
                btn.hide();
                return false;
            }
        });
    },

    isPrintBtnVisible: function(data) {
        return Ext.Array.contains(['saved','closed'], data['purchaseorder'].get('purchaseorder_status'));
    },

    isForwardVendorBtnVisible: function(data) {
        return Ext.Array.contains(['saved','closed'], data['purchaseorder'].get('purchaseorder_status'));
    },

    isForwardBtnVisible: function(data) {
        return (data['purchaseorder'].get('purchaseorder_id') !== null);
    },

    isBudgetReportBtnVisible: function(data) {
        return (
            data['purchaseorder'].get('purchaseorder_status') == 'open'
            && data['purchaseorder'].get('purchaseorder_period') != null
        );
    },

    isSaveTemplateBtnVisible: function (data) {
        return (data['purchaseorder'].get('purchaseorder_status') == 'open');
    },

    isUploadImageBtnVisible: function(data) {
        var validStatuses    = NP.Config.getSetting('pn.InvoiceOptions.ScanStatus', ''),
            validStatusArray = validStatuses.split(',');

        return (
            data['purchaseorder'].get('purchaseorder_id') !== null
            && NP.Config.getSetting('pn.main.FileUpload', '0') == '1'
            && (
                validStatuses == 'All'
                || Ext.Array.contains(validStatusArray, data['purchaseorder'].get('purchaseorder_status'))
            )
        );
    },

    isAddImageBtnVisible: function(data) {
        return (
            data['purchaseorder'].get('purchaseorder_id') !== null
            && NP.Config.getSetting('pn.main.WebDoczDB', '') != ''
        );
    },

    _isVendorValid: function(data) {
        return (
            (
                data['purchaseorder'].get('vendor_status') == 'approved'
                || data['purchaseorder'].get('vendor_status') == 'active'
            )
            && (
                data['purchaseorder'].get('vendorsite_status') == 'approved'
                || data['purchaseorder'].get('vendorsite_status') == 'active'
            )
        );
    },

    isReadyBtnVisible: function(data) {
        var me    = this,
            btn   = Ext.ComponentQuery.query('#poReadyForProcessingBtn')[0],
            tries = 0;

        // We need a function we can defer and recall in case we need to
        // wait for some views to render or stores to load
        function showBtn() {
            tries++;
            var warningView = Ext.ComponentQuery.query('[xtype="shared.invoicepo.viewwarnings"] dataview'),
                lineView    = Ext.ComponentQuery.query('[xtype="shared.invoicepo.viewlines"] dataview');

            // If views aren't ready or stores haven't loaded, defer the process
            if (!warningView.length || !lineView.length
                || !warningView[0].getStore().isLoaded || !lineView[0].getStore().isLoaded
            ) {
                // Put a limit on the number of times setTimeout can run just so it doesn't run forever
                if (tries < 50) {
                    Ext.defer(showBtn, 1000);
                }
                return false;
            }

            var hasExpiredInsurance = false;
            if (NP.Config.getSetting('CP.AllowExpiredInsurance', '1') == '0') {
                var warningStore     = warningView[0].getStore(),
                    insuranceWarning = warningStore.findExact('warning_type', 'insuranceExpiration');
                
                if (insuranceWarning !== -1) {
                    insuranceWarning = warningStore.getAt(insuranceWarning);
                    hasExpiredInsurance = insuranceWarning.get('warning_data').expired;
                }
            }
            
            if (
                me._isVendorValid(data)
                && data['purchaseorder'].get('purchaseorder_status') == 'open' 
                && lineView[0].getStore().getCount() > 0
                && NP.Security.hasPermission(1027)      // New PO permission
                && !hasExpiredInsurance
            ) {
                btn.show();
                return true;
            } else {
                btn.hide();
                return false;
            }
        }

        return showBtn();
    },

    isFinalReviewBtnVisible: function(data) {
        var po = data['purchaseorder'];

        return (
            po.get('purchaseorder_status') == 'saved'
            && po.get('purchaseorder_rct_req') == 1
            && po.get('purchaseorder_rct_canReceive') != 1
            && NP.Config.getSetting('RECEIVING_FINALREVIEW', '0') == 1
        );
    },

    isMarkReceivedBtnVisible: function(data) {
        var me = this;

        return me.deferUntilLinesLoaded(function() {
            var btn = Ext.ComponentQuery.query('#markAsReceivedBtn')[0],
                po  = data['purchaseorder'];
            
            if (
                po.get('purchaseorder_status') == 'saved'
                && po.get('purchaseorder_rct_req') == 1
                && me.hasReceivableLines()
            ) {
                btn.show();
                return true;
            } else {
                btn.hide();
                return false;
            }
        });
    },

    isRouteBtnVisible: function(data) {
        var me = this;

        return (
            me.isApproveBtnVisible(data)
            && data['has_optional_rule']
        );
    },

    isRouteManuallyBtnVisible: function(data) {
        var me = this;

        return (
            me.isReleaseBtnVisible(data)
            && data['has_optional_rule']
        );
    },

    isModifyBtnVisible: function(data) {
        var me = this;

        if (data['purchaseorder'].get('purchaseorder_id') === null) {
            return false;
        }

        return me.deferUntilLinesLoaded(function() {
            var btn       = Ext.ComponentQuery.query('#poModifyBtn')[0],
                po_status = data['purchaseorder'].get('purchaseorder_status');
            
            if (
                (
                    (
                        NP.Security.hasPermission(6074)     // Modify Any
                        || (
                            NP.Security.hasPermission(6075) // Modify Only Created
                            && data['userprofile_id'] == NP.Security.getUser().get('userprofile_id')
                        )
                    )
                    && (
                        (status == 'saved' && NP.Security.hasPermission(2045))
                        || status == 'rejected'
                    )
                    && !me.hasLinkedLines()
                )
                || status == 'forapproval'
            ) {
                btn.show();
                return true;
            } else {
                btn.hide();
                return false;
            }
        });
    },

    isModifyHeaderCustomBtnVisible: function(data) {
        return (
            data['purchaseorder'].get('purchaseorder_status') == "saved"
            && !NP.Security.hasPermission(6011)
        );
    },

    isPostApproveRejectBtnVisible: function(data) {
        return (
            data['purchaseorder'].get('purchaseorder_status') == "saved"
            && NP.Security.hasPermission(1068) // Invoice Post Approval Modify
            && NP.Config.getSetting('PN.InvoiceOptions.SkipSave', '0') == '0'
        );
    },

    isCopyBtnVisible: function(data) {
        return (data['purchaseorder'].get('purchaseorder_status') == "draft");
    },

    isScheduleBtnVisible: function(data) {
        return (
            data['purchaseorder'].get('purchaseorder_status') == "draft"
            && !data['schedule_exists']
        );
    },

    isModifyScheduleBtnVisible: function(data) {
        return (
            data['purchaseorder'].get('purchaseorder_status') == "draft"
            && data['schedule_exists']
        );
    },

    isAutoSubmitBtnVisible: function(data) {
        // TODO: need to define is_electronic_po and hasBeenAutoSubmitted in data pulled for PO
        return (
            data['is_electronic_po']
            && data['has_been_auto_submitted']
        );
    },

    isBrowseCatalogBtnVisible: function(data) {
        if (data['purchaseorder'].get('purchaseorder_id') === null) {
            return false;
        }

        return (
            data['purchaseorder'].get('purchaseorder_status') == "open"
            && NP.Config.getSetting('VC_isOn', '0') == 1
            // Need to add the getMatchingCatalog() condition
        );
    },

    isReleaseBtnVisible: function(data) {
        var me = this;

        return (
            me._isVendorValid(data)
            && data['purchaseorder'].get('purchaseorder_status') == 'approved'
        );
    },

    isProcessBtnVisible: function(data) {
        var me = this;

        return me.deferUntilLinesLoaded(function() {
            var btn = Ext.ComponentQuery.query('#processInvoiceBtn')[0],
                po  = data['purchaseorder'];;

            if (
                po.get('purchaseorder_status') == 'saved'
                && (
                    po.get('purchaseorder_rct_req') != 1
                    || me.hasApprovedReceipt()
                )
            ) {
                btn.show();
                return true;
            } else {
                btn.hide();
                return false;
            }
        });
    },

    hasApprovedReceipt: function() {
        var lineView         = Ext.ComponentQuery.query('[xtype="shared.invoicepo.viewlines"] dataview')[0],
            lineStore        = lineView.getStore(),
            hasApprovedReceipt = false;

        lineStore.each(function(rec) {
            if (rec.get('poitem_isReceived') == 1 && rec.get('receipt_status') == 'approved') {
                hasApprovedReceipt = true;
                return false;
            }
        });

        return hasApprovedReceipt;
    }
});