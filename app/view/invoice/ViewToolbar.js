/**
 * The toolbar for the invoice view page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.ViewToolbar', {
    extend: 'NP.view.shared.PermissionToolbar',
    alias: 'widget.invoice.viewtoolbar',

    requires: [
        'NP.lib.core.Security',
        'NP.lib.core.Config',
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
                itemId          : 'invoiceSaveBtn',
                xtype           : 'shared.button.save',
                displayCondition: me.isSaveBtnVisible.bind(me)
            },{
                text            : 'Approve',
                itemId          : 'invoiceApproveBtn',
                iconCls         : 'approve-btn',
                moduleId        : 1031,
                displayCondition: me.isApproveBtnVisible.bind(me)
            },{
                text            : 'Approve and Next',
                itemId          : 'invoiceApproveAndNextBtn',
                iconCls         : 'approve-next-btn',
                moduleId        : 1031,
                displayCondition: me.isApproveBtnVisible.bind(me)
            },{
                text            : 'Reject',
                itemId          : 'invoiceRejectBtn',
                iconCls         : 'reject-btn',
                moduleId        : 1031,
                displayCondition: me.isRejectBtnVisible.bind(me)
            },{
                xtype           : 'shared.button.process',
                text            : 'Ready For Processing',
                itemId          : 'invoiceReadyForProcessingBtn',
                moduleId        : 2041,
                displayCondition: me.isReadyBtnVisible.bind(me)
            },{
                xtype           : 'shared.button.edit',
                text            : 'Modify',
                itemId          : 'invoiceModifyBtn',
                displayCondition: me.isModifyBtnVisible.bind(me)
            },{
                xtype           : 'shared.button.delete',
                itemId          : 'invoiceDeleteBtn',
                displayCondition: me.isDeleteBtnVisible.bind(me)
            },{
                text            : 'Submit For Payment',
                itemId          : 'invoiceSubmitForPaymentBtn',
                iconCls         : 'payment-btn',
                displayCondition: me.isSubmitPaymentBtnVisible.bind(me)
            },{
                text            : 'Reject', // This is post approve reject, not to be confused with other reject
                itemId          : 'invoicePostRejectBtn',
                iconCls         : 'reject-btn',
                moduleId        : 6002,
                displayCondition: me.isPostApproveRejectBtnVisible.bind(me)
            },{
                xtype           : 'shared.button.hourglass',
                text            : 'Place on Hold',
                itemId          : 'invoiceOnHoldBtn',
                moduleId        : 6001,
                displayCondition: me.isOnHoldBtnVisible.bind(me)
            },{
                text            : 'Activate',
                itemId          : 'activateBtn',
                iconCls         : 'hold-activate-btn',
                moduleId        : 6001,
                displayCondition: me.isActivateBtnVisible.bind(me)
            },{
                text            : 'Revert to Invoice',
                itemId          : 'invoiceRevertBtn',
                iconCls         : 'revert-btn',
                moduleId        : 1067,
                displayCondition: me.isRevertBtnVisible.bind(me)
            },{
                text            : 'Reclass',
                itemId          : 'invoiceReclassBtn',
                iconCls         : 'reclass-btn',
                displayCondition: me.isReclassBtnVisible.bind(me)
            },{
                text            : 'Void',
                itemId          : 'invoiceVoidBtn',
                iconCls         : 'void-btn',
                moduleId        : 6069,
                displayCondition: me.isVoidBtnVisible.bind(me)
            },{
                text            : 'Approve and Route Manually',
                iconCls         : 'route-btn',
                moduleId        : 1031,
                displayCondition: me.isRouteBtnVisible.bind(me)
            },{
                text            : 'Pass and Route Manually',
                iconCls         : 'route-btn',
                moduleId        : 6004,
                displayCondition: me.isRouteBtnVisible.bind(me)
            },{
                text            : 'Apply Template',
                itemId          : 'invoiceApplyTemplateBtn',
                iconCls         : 'template-apply-btn',
                displayCondition: me.isApplyTemplateBtnVisible.bind(me)
            },{
                text            : 'Use Template',
                itemId          : 'invoiceUseTemplateBtn',
                iconCls         : 'template-apply-btn',
                displayCondition: me.isUseTemplateBtnVisible.bind(me)
            },{
                text            : 'Create Copy',
                itemId          : 'invoiceCreateCopy',
                iconCls         : 'copy-btn',
                moduleId        : 2006,
                displayCondition: me.isCopyBtnVisible.bind(me)
            },{
                text            : 'Create Schedule',
                itemId          : 'invoiceCreateSchedule',
                iconCls         : 'schedule-btn',
                moduleId        : 2018,
                displayCondition: me.isScheduleBtnVisible.bind(me)
            },{
                text            : 'Modify Schedule',
                itemId          : 'invoiceModifySchedule',
                iconCls         : 'schedule-btn',
                moduleId        : 2018,
                displayCondition: me.isModifyScheduleBtnVisible.bind(me)
            },{
                text            : 'Manage Images',
                itemId          : 'invoiceImageManageBtn',
                iconCls         : 'image-manage-btn',
                displayCondition: me.isManageImagesBtnVisible.bind(me)
            },{
                text            : 'Link to PO',
                iconCls         : 'link-btn',
                moduleId        : 2038,
                displayCondition: me.isLinkPoBtnVisible.bind(me)
            },{
                text            : 'Forward',
                itemId          : 'invoiceForwardBtn',
                iconCls         : 'message-btn',
                componentCls    : 'message-comp-btn',
                moduleId        : 2026,
                displayCondition: me.isForwardBtnVisible.bind(me)
            },
            {
                xtype: 'tbseparator',
                displayCondition: me.isMenuVisible.bind(me)
            },
            {
                text    : 'Actions',
                defaults: { hidden: false },
                displayCondition: me.isMenuVisible.bind(me),
                menu    : [
                    {
                        text            : 'Change Property',
                        itemId          : 'invoiceChangePropertyBtn',
                        iconCls         : 'property-btn',
                        displayCondition: me.isChangePropertyBtnVisible.bind(me)
                    },{
                        text            : 'Print',
                        itemId          : 'invoicePrintBtn',
                        iconCls         : 'print-btn',
                        displayCondition: me.isPrintBtnVisible.bind(me)
                    },{
                        text            : 'Budget Report',
                        iconCls         : 'report-btn',
                        moduleId        : 1039,
                        displayCondition: me.isBudgetReportBtnVisible.bind(me)
                    },{
                        text            : 'Save as Template',
                        itemId          : 'invoiceSaveTemplateBtn',
                        iconCls         : 'template-save-btn',
                        moduleId        : 2008,
                        displayCondition: me.isSaveTemplateBtnVisible.bind(me)
                    },{
                        text            : 'Save as User Template',
                        itemId          : 'invoiceSaveUserTemplateBtn',
                        iconCls         : 'template-save-user-btn',
                        moduleId        : 2006,
                        displayCondition: me.isSaveUserTemplateBtnVisible.bind(me)
                    },{
                        text            : 'Apply Payment',
                        itemId          : 'applyPaymentBtn',
                        iconCls         : 'approve-btn',
                        moduleId        : 6064,
                        displayCondition: me.isApplyPaymentBtnVisible.bind(me)
                    }
                ]
            },
            {
                xtype: 'tbseparator',
                displayCondition: me.isMenuVisible.bind(me)
            },
            {
                text    : 'Images',
                defaults: { hidden: false },
                displayCondition: me.isMenuVisible.bind(me),
                menu    : [
                    {
                        text            : 'Upload Image',
                        itemId          : 'invoiceImageUploadBtn',
                        iconCls         : 'upload-btn',
                        moduleId        : 2081,
                        displayCondition: me.isUploadImageBtnVisible.bind(me)
                    },
                    {
                        text            : 'View Image',
                        itemId          : 'invoiceImageViewBtn',
                        iconCls         : 'image-view-btn',
                        displayCondition: me.isManageImagesBtnVisible.bind(me)
                    },
                    {
                        text            : 'Add Image',
                        itemId          : 'invoiceImageAddBtn',
                        iconCls         : 'image-add-btn',
                        moduleId        : 2039,
                        displayCondition: me.isAddImageBtnVisible.bind(me)
                    }
                ]
            }
        ];

    	this.callParent(arguments);
    },

    isInvoiceReadOnly: function() {
        return NP.app.getController('Invoice').isInvoiceReadOnly();
    },

    isSaveBtnVisible: function(data) {
        var invoice_status = data['invoice'].get('invoice_status');

        return (
            !this.isInvoiceReadOnly()
            && (
                (
                    invoice_status == 'open'
                    && (
                        (
                            NP.Security.hasPermission(1032) // New Invoice permission
                            && data['invoice'].get('invoice_id') === null
                        )
                        || NP.Security.hasPermission(6076)  // Modify Any permission
                        || NP.Security.hasPermission(6077)  // Modify Only Created permission
                    )
                ) || (
                    invoice_status == 'saved'
                    && NP.Security.hasPermission(1068)      // Invoice Post Approval Modify permission
                )
                && NP.Config.getSetting('PN.InvoiceOptions.SkipSave', '0') == '0'
            ) || (
                invoice_status == 'forapproval'
                && data['is_approver'] === true
            ) || (
                invoice_status == 'draft'
                && NP.Security.hasPermission(2008)          // Invoice Templates
            )
        );
    },

    isDeleteBtnVisible: function(data) {
        var invoice_status = data['invoice'].get('invoice_status');

        if (data['invoice'].get('invoice_id') === null) {
            return false;
        }

        return (
            !this.isInvoiceReadOnly()
            && (
                invoice_status == 'draft' 
                && NP.Security.hasPermission(2008)  // Invoice Templates permission
            ) || (
                Ext.Array.contains(['saved','open','rejected','hold'], invoice_status)
                && (
                    (
                        data['invoice'].get('userprofile_id') == NP.Security.getUser().get('userprofile_id')
                        && NP.Security.hasPermission(6063)  // Delete My Invoice permission
                    ) || NP.Security.hasPermission(2000)       // Delete Any Invoice permission
                )
            )
        )
    },

    isOnHoldBtnVisible: function(data) {
        return (
            !this.isInvoiceReadOnly()
            && data['invoice'].get('invoice_id') !== null
            && Ext.Array.contains(['open','forapproval','saved'], data['invoice'].get('invoice_status'))
        );
    },

    isVoidBtnVisible: function(data) {
        return (
            !this.isInvoiceReadOnly()
            && data['invoice'].get('invoice_id') !== null
            && !Ext.Array.contains(['hold','void','template','paid','draft'], data['invoice'].get('invoice_status'))
        );
    },

    isApplyTemplateBtnVisible: function(data) {
        return (
            !this.isInvoiceReadOnly()
            && data['invoice'].get('invoice_id') !== null
            && data['invoice'].get('invoice_status') == 'open'
            && (
                NP.Security.hasPermission(2006)     // Invoice User Templates permission
                || NP.Security.hasPermission(2008)  // Invoice Templates permission
            )
        );
    },

    isUseTemplateBtnVisible: function(data) {
        return (
            !this.isInvoiceReadOnly()
            && data['invoice'].get('invoice_status') == 'draft'
            && data['property_status'] != -1     // Property is not on hold
            && (
                NP.Security.hasPermission(2006)     // Invoice User Templates permission
                || NP.Security.hasPermission(2008)  // Invoice Templates permission
            )
        );
    },

    isApproveBtnVisible: function(data) {
        var me = this;
        return (
            me.isRejectBtnVisible(data)
            && NP.Config.getSetting('pn.jobcosting.jobcostingEnabled', '0') == '1'
            && data['inactive_contracts'].length == 0
            && data['inactive_jobs'].length == 0
        );
    },

    isRejectBtnVisible: function(data) {
        return (
            data['invoice'].get('invoice_status') == 'forapproval'
            && data['is_approver']
        );
    },

    isMenuVisible: function(data) {
        return (data['invoice'].get('invoice_id') !== null);
    },

    isManageImagesBtnVisible: function(data) {
        return (data['image'] !== null);
    },

    isLinkPoBtnVisible: function(data) {
        return (
            !this.isInvoiceReadOnly()
            && data['invoice'].get('invoice_status') == 'open'
            && data['invoice'].get('invoice_id') != null
            && data['has_linkable_pos']
        );
    },

    isChangePropertyBtnVisible: function(data) {
        var status = data['invoice'].get('invoice_status');
        return (
            !this.isInvoiceReadOnly()
            && data['invoice'].get('invoice_id') !== null
            && (
                status == 'draft'
                || (
                    status == 'open'
                    && (
                        NP.Security.hasPermission(1032)     // New Invoice permission
                        || NP.Security.hasPermission(6076)  // Modify Any permission
                        || NP.Security.hasPermission(6077)  // Modify Only Created permission
                    )
                )
                || (
                    status == 'saved' 
                    && NP.Security.hasPermission(1068) 
                    && NP.Config.getSetting('PN.InvoiceOptions.SkipSave') == '0'
                )
            )
        );
    },

    isPrintBtnVisible: function(data) {
        return Ext.Array.contains(['paid','forapproval','submitted','sent','saved','posted','void'], data['invoice'].get('invoice_status'));
    },

    isForwardBtnVisible: function(data) {
        return (data['invoice'].get('invoice_id') !== null);
    },

    isBudgetReportBtnVisible: function(data) {
        return (
            !Ext.Array.contains(['hold','void'], data['invoice'].get('invoice_status'))
        );
    },

    isSaveTemplateBtnVisible: function(data) {
        return this._isSaveTemplateBtnVisible(data, 2008, 'invoiceSaveTemplateBtn');
    },

    isSaveUserTemplateBtnVisible: function(data) {
        return this._isSaveTemplateBtnVisible(data, 2006, 'invoiceSaveUserTemplateBtn');
    },

    _isSaveTemplateBtnVisible: function (data, moduleId, btnId) {
        var btn   = Ext.ComponentQuery.query('#' + btnId)[0],
            tries = 0;

        // We need a function we can defer and recall in case we need to
        // wait for some views to render or stores to load
        function showBtn() {
            tries++;
            var lineView = Ext.ComponentQuery.query('[xtype="shared.invoicepo.viewlines"] dataview');

            // If views aren't ready or stores haven't loaded, defer the process
            if (!lineView.length || !lineView[0].getStore().isLoaded) {
                if (tries < 6) {
                    Ext.defer(showBtn, 750);
                }
                return false;
            }

            if (
                data['invoice'].get('invoice_status') == 'open' 
                && lineView[0].getStore().getCount() > 0
                && NP.Security.hasPermission(moduleId)
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

    isUploadImageBtnVisible: function(data) {
        var validStatuses    = NP.Config.getSetting('pn.InvoiceOptions.ScanStatus', ''),
            validStatusArray = validStatuses.split(',');

        return (
            data['invoice'].get('invoice_id') !== null
            && NP.Config.getSetting('pn.main.FileUpload', '0') == '1'
            && (
                NP.Config.getSetting('pn.InvoiceOptions.ScanStatus', '') == 'All'
                || Ext.Array.contains(validStatusArray, data['invoice'].get('invoice_status'))
            )
        );
    },

    isAddImageBtnVisible: function(data) {
        return (
            data['invoice'].get('invoice_id') !== null
            && NP.Config.getSetting('pn.main.WebDoczDB', '') != ''
        );
    },

    isReadyBtnVisible: function(data) {
        if (this.isInvoiceReadOnly()) {
            return false;
        }

        var btn   = Ext.ComponentQuery.query('#invoiceReadyForProcessingBtn')[0],
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
                data['invoice'].get('invoice_status') == 'open' 
                && lineView[0].getStore().getCount() > 0
                && warningStore.findExact('warning_type', 'invoiceDuplicate') === -1
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

    isRevertBtnVisible: function(data) {
        var status = data['invoice'].get('invoice_status');
        return (
            !this.isInvoiceReadOnly()
            && (status == "sent"|| status == "paid" || status == "posted")
            && NP.Security.hasPermission(2041) // Submit Invoices
        );
    },

    isReclassBtnVisible: function(data) {
        return (
            !this.isInvoiceReadOnly()
            && data['invoice'].get('invoice_status') == 'paid'
            && (
                NP.Security.hasPermission(2094)     // Reclass Invoice - Any Field
                || NP.Security.hasPermission(6093)  // Reclass Invoice - Line Item Only
            )
        );
    },

    isApplyPaymentBtnVisible: function(data) {
        return (
            !this.isInvoiceReadOnly()
            && Ext.Array.contains(
                ['paid','saved','approved','submitted','posted','sent'],
                data['invoice'].get('invoice_status')
            )
        );
    },

    isRouteBtnVisible: function(data) {
        var me = this;

        return (
            me.isApproveBtnVisible(data)
            && data['has_optional_rule']
        );
    },

    isActivateBtnVisible: function(data) {
        var show = false;

        if (
            data['invoice'].get('invoice_status') == 'hold'
            && NP.Security.hasPermission(6001)          // Invoices On Hold
        ) {
            if (NP.Security.hasPermission(6079)) {      // Activate Any
                show = true;
            }
            else if (NP.Security.hasPermission(6078) && data['hold_notes'].length) { // Activate
                var lastNote = data['hold_notes'].length-1;

                lastNote = data['hold_notes'][lastNote];
                
                if (lastNote['userprofile_id'] == NP.Security.getUser().get('userprofile_id')) {
                    show = true;
                }
            }
        }

        if (show) {
            return true;
        } else {
            return false;
        }
    },

    isModifyBtnVisible: function(data) {
        var status = data['invoice'].get('invoice_status');

        return (
            !this.isInvoiceReadOnly()
            && (
                (
                    (
                        (
                            NP.Security.hasPermission(2044) // Modify Button on Invoices
                            && Ext.Array.contains(['saved','submitted','forapproval'], status)
                        ) || status == 'rejected'
                    ) && !this.isSaveBtnVisible(data)
                ) || (
                    status == 'forapproval'
                    && data['is_approver']
                    && NP.Security.hasPermission(2044)      // Modify Button on Invoices
                )
            ) && (
                NP.Security.hasPermission(6076)     // Modify Any
                || (
                    NP.Security.hasPermission(6077) // Modify Only Created
                    && data['userprofile_id'] == NP.Security.getUser().get('userprofile_id')
                )
            )
        );
    },

    isSubmitPaymentBtnVisible: function(data) {
        return (
            !this.isInvoiceReadOnly()
            && data['invoice'].get('invoice_status') == 'saved'
            && NP.Security.hasPermission(1068) // Invoice Post Approval Modify
            && (data['vendor_status'] == 'approved' || data['vendor_status'] == 'active')
            && (data['vendorsite_status'] == 'approved' || data['vendorsite_status'] == 'active')
            && (
                NP.Config.getSetting('pn.jobcosting.jobcostingEnabled', '0') != '1'
                || data['inactive_jobs'].length == 0
            )
            && !data['has_dummy_accounts']
        );
    },

    isPostApproveRejectBtnVisible: function(data) {
        return (
            data['invoice'].get('invoice_status') == "saved"
            && NP.Security.hasPermission(1068) // Invoice Post Approval Modify
            && NP.Config.getSetting('PN.InvoiceOptions.SkipSave', '0') == '0'
        );
    },

    isCopyBtnVisible: function(data) {
        return (data['invoice'].get('invoice_status') == "draft");
    },

    isScheduleBtnVisible: function(data) {
        return (
            data['invoice'].get('invoice_status') == "draft"
            && !data['schedule_exists']
        );
    },

    isModifyScheduleBtnVisible: function(data) {
        return (
            data['invoice'].get('invoice_status') == "draft"
            && data['schedule_exists']
        );
    }
});