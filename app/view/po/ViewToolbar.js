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
                text            : 'Approve',
                itemId          : 'poApproveBtn',
                iconCls         : 'approve-btn',
                moduleId        : 1031,
                displayCondition: me.isApproveBtnVisible.bind(me)
            },{
                text            : 'Approve and Next',
                itemId          : 'poApproveAndNextBtn',
                iconCls         : 'approve-next-btn',
                moduleId        : 1031,
                displayCondition: me.isApproveBtnVisible.bind(me)
            },{
                text            : 'Reject',
                itemId          : 'poRejectBtn',
                iconCls         : 'reject-btn',
                moduleId        : 1031,
                displayCondition: me.isRejectBtnVisible
            },{
                xtype           : 'shared.button.process',
                text            : 'Ready For Processing',
                itemId          : 'readyForProcessingBtn',
                moduleId        : 2041,
                displayCondition: me.isReadyBtnVisible
            },{
                xtype           : 'shared.button.edit',
                text            : 'Modify',
                itemId          : 'poModifyBtn',
                displayCondition: me.isModifyBtnVisible.bind(me)
            },{
                xtype           : 'shared.button.delete',
                itemId          : 'poDeleteBtn',
                displayCondition: me.isDeleteBtnVisible
            },{
                text            : 'Reject', // This is post approve reject, not to be confused with other reject
                itemId          : 'poPostRejectBtn',
                iconCls         : 'reject-btn',
                moduleId        : 6002,
                displayCondition: me.isPostApproveRejectBtnVisible
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
                itemId          : 'poApplyTemplateBtn',
                iconCls         : 'template-apply-btn',
                displayCondition: me.isApplyTemplateBtnVisible
            },{
                xtype           : 'shared.button.edit',
                text            : 'Modify Template',
                displayCondition: me.isUseTemplateBtnVisible.bind(me)
            },{
                text            : 'Use Template',
                iconCls         : 'template-apply-btn',
                displayCondition: me.isUseTemplateBtnVisible
            },{
                text            : 'Create Copy',
                iconCls         : 'copy-btn',
                moduleId        : 2006,
                displayCondition: me.isCopyBtnVisible
            },{
                text            : 'Create Schedule',
                iconCls         : 'schedule-btn',
                moduleId        : 2018,
                displayCondition: me.isScheduleBtnVisible
            },{
                text            : 'Modify Schedule',
                iconCls         : 'schedule-btn',
                moduleId        : 2018,
                displayCondition: me.isModifyScheduleBtnVisible
            },{
                text            : 'Manage Images',
                itemId          : 'poImageManageBtn',
                iconCls         : 'image-manage-btn',
                displayCondition: me.isManageImagesBtnVisible
            },{
                text            : 'Link to PO',
                iconCls         : 'link-btn',
                moduleId        : 2038,
                displayCondition: me.isLinkPoBtnVisible
            },{
                text            : 'Forward',
                itemId          : 'poForwardBtn',
                iconCls         : 'message-btn',
                componentCls    : 'message-comp-btn',
                moduleId        : 2026,
                displayCondition: me.isForwardBtnVisible
            },
            {
                xtype: 'tbseparator',
                displayCondition: me.isMenuVisible
            },
            {
                text    : 'Actions',
                defaults: { hidden: false },
                displayCondition: me.isMenuVisible,
                menu    : [
                    {
                        text            : 'Print',
                        itemId          : 'poPrintBtn',
                        iconCls         : 'print-btn',
                        displayCondition: me.isPrintBtnVisible
                    },{
                        text            : 'Budget Report',
                        iconCls         : 'report-btn',
                        moduleId        : 1039,
                        displayCondition: me.isBudgetReportBtnVisible
                    },{
                        text            : 'Save as Template',
                        itemId          : 'saveTemplateBtn',
                        iconCls         : 'template-save-btn',
                        moduleId        : 2008,
                        displayCondition: me.isSaveTemplateBtnVisible.bind(me)
                    },{
                        text            : 'Save as User Template',
                        itemId          : 'saveUserTemplateBtn',
                        iconCls         : 'template-save-user-btn',
                        moduleId        : 2006,
                        displayCondition: me.isSaveUserTemplateBtnVisible.bind(me)
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
                        text            : 'Upload Image',
                        itemId          : 'poImageUploadBtn',
                        iconCls         : 'upload-btn',
                        moduleId        : 2081,
                        displayCondition: me.isUploadImageBtnVisible
                    },
                    {
                        text            : 'View Image',
                        itemId          : 'poImageViewBtn',
                        iconCls         : 'image-view-btn',
                        displayCondition: me.isManageImagesBtnVisible
                    },
                    {
                        text            : 'Add Image',
                        itemId          : 'poImageAddBtn',
                        iconCls         : 'image-add-btn',
                        moduleId        : 2039,
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
                        NP.Security.hasPermission(1032)     // New Invoice permission
                        || NP.Security.hasPermission(6076)  // Modify Any permission
                        || NP.Security.hasPermission(6077)  // Modify Only Created permission
                    )
                ) || (
                    po_status == 'saved'
                    && NP.Security.hasPermission(1068)      // Invoice Post Approval Modify permission
                )
                && NP.Config.getSetting('PN.InvoiceOptions.SkipSave', '0') == '0'
            ) || (
                po_status == 'forapproval'
                && data['is_approver'] === true
            ) || (
                po_status == 'draft'
                && NP.Security.hasPermission(2008)          // Invoice Templates
            )
        );
    },

    isDeleteBtnVisible: function(data) {
        var po_status = data['purchaseorder'].get('purchaseorder_status');

        if (data['purchaseorder'].get('purchaseorder_id') === null) {
            return false;
        }

        return (
            (
                po_status == 'draft' 
                && NP.Security.hasPermission(2008)  // Invoice Templates permission
            ) || (
                Ext.Array.contains(['saved','open','rejected','hold'], po_status)
                && (
                    (
                        data['purchaseorder'].get('userprofile_id') == NP.Security.getUser().get('userprofile_id')
                        && NP.Security.hasPermission(6063)  // Delete My Invoice permission
                    ) || NP.Security.hasPermission(2000)       // Delete Any Invoice permission
                )
            )
        )
    },

    isApplyTemplateBtnVisible: function(data) {
        return (
            data['purchaseorder'].get('purchaseorder_id') !== null &&
            data['purchaseorder'].get('purchaseorder_status') == 'open'
            && (
                NP.Security.hasPermission(2006)     // Invoice User Templates permission
                || NP.Security.hasPermission(2008)  // Invoice Templates permission
            )
        );
    },

    isUseTemplateBtnVisible: function(data) {
        return (
            data['purchaseorder'].get('purchaseorder_status') == 'draft'
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
            data['purchaseorder'].get('purchaseorder_status') == 'forapproval'
            && data['is_approver']
        );
    },

    isMenuVisible: function(data) {
        return (data['purchaseorder'].get('purchaseorder_id') !== null);
    },

    isManageImagesBtnVisible: function(data) {
        return (data['image'] !== null);
    },

    isLinkPoBtnVisible: function(data) {
        return (
            data['purchaseorder'].get('purchaseorder_status') == 'open'
            && data['purchaseorder'].get('purchaseorder_id') != null
            && data['has_linkable_pos']
        );
    },

    isPrintBtnVisible: function(data) {
        return Ext.Array.contains(['paid','forapproval','submitted','sent','saved','posted','void'], data['purchaseorder'].get('purchaseorder_status'));
    },

    isForwardBtnVisible: function(data) {
        return (data['purchaseorder'].get('purchaseorder_id') !== null);
    },

    isBudgetReportBtnVisible: function(data) {
        return !Ext.Array.contains(['hold','void'], data['purchaseorder'].get('purchaseorder_status'));
    },

    isSaveTemplateBtnVisible: function(data) {
        return this._isSaveTemplateBtnVisible(data, 2008, 'saveTemplateBtn');
    },

    isSaveUserTemplateBtnVisible: function(data) {
        return this._isSaveTemplateBtnVisible(data, 2006, 'saveUserTemplateBtn');
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
                data['purchaseorder'].get('purchaseorder_status') == 'open' 
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
            data['purchaseorder'].get('purchaseorder_id') !== null
            && NP.Config.getSetting('pn.main.FileUpload', '0') == '1'
            && (
                NP.Config.getSetting('pn.InvoiceOptions.ScanStatus', '') == 'All'
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

    isReadyBtnVisible: function(data) {
        var btn   = Ext.ComponentQuery.query('#readyForProcessingBtn')[0],
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

            if (
                data['purchaseorder'].get('purchaseorder_status') == 'open' 
                && lineView[0].getStore().getCount() > 0
                && warningView[0].getStore().find('warning_type', 'invoiceDuplicate') === -1
                && NP.Security.hasPermission(2041)
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

    isRouteBtnVisible: function(data) {
        var me = this;

        return (
            me.isApproveBtnVisible(data)
            && data['has_optional_rule']
        );
    },

    isModifyBtnVisible: function(data) {
        var status = data['purchaseorder'].get('purchaseorder_status');

        return (
            (
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
            && !data['scheduleExists']
        );
    },

    isModifyScheduleBtnVisible: function(data) {
        return (
            data['purchaseorder'].get('purchaseorder_status') == "draft"
            && data['scheduleExists']
        );
    }
});