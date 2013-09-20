/**
 * The toolbar for the invoice view page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.ViewToolbar', {
    extend: 'NP.view.shared.PermissionToolbar',
    alias: 'widget.invoice.viewtoolbar',

    requires: [
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save',
        'NP.view.shared.button.Delete',
        'NP.view.shared.button.Hourglass',
        'NP.view.shared.button.Upload',
        'NP.view.shared.button.New'
    ],

    // For localization
    
    initComponent: function() {
        var me = this;

        me.items = [
            {
                xtype: 'shared.button.cancel'
            },{
                xtype           : 'shared.button.save',
                displayCondition: me.isSaveBtnVisible
            },{
                text            : 'Approve',
                displayCondition: Ext.bind(me.isApproveBtnVisible, me)
            },{
                text            : 'Approve and Next',
                displayCondition: Ext.bind(me.isApproveBtnVisible, me)
            },{
                text: 'Reject',
                displayCondition: me.isRejectBtnVisible
            },{
                text            : 'Ready For Processing',
                moduleId        : 2041,
                displayCondition: me.isReadyBtnVisible 
            },{
                xtype           : 'shared.button.delete',
                displayCondition: me.isDeleteBtnVisible
            },{
                xtype           : 'shared.button.hourglass',
                text            : 'Place on Hold',
                moduleId        : 6001,
                displayCondition: me.isOnHoldBtnVisible
            },{
                text            : 'Void',
                moduleId        : 6069,
                displayCondition: me.isVoidBtnVisible
            },{
                text: 'Optional Workflow'   // TODO: add conditions for this (workflow dependent)
            },{
                text            : 'Apply Template',
                displayCondition: me.isApplyTemplateBtnVisible
            },{
                text            : 'Use Template',
                displayCondition: me.isUseTemplateBtnVisible
            },{
                text            : 'Manage Images',
                displayCondition: me.isManageImagesBtnVisible
            },{
                text            : 'Link to PO',
                moduleId        : 2038,
                displayCondition: me.isLinkPoBtnVisible
            },
            '-',
            {
                text    : 'Actions',
                defaults: { hidden: false },
                menu    : [
                    {
                        text            : 'Print',
                        displayCondition: me.isPrintBtnVisible
                    },
                    {
                        text            : 'Forward',
                        moduleId        : 2026,
                        displayCondition: me.isForwardBtnVisible
                    },
                    {
                        text            : 'Budget Report',
                        moduleId        : 1039,
                        displayCondition: me.isBudgetReportBtnVisible
                    },
                    {
                        text            : 'Save as Template',
                        moduleId        : 2008,
                        displayCondition: me.isSaveTemplateBtnVisible
                    },
                    {
                        text            : 'Save as User Template',
                        moduleId        : 2006,
                        displayCondition: me.isSaveTemplateBtnVisible
                    }
                ]
            },
            '-',
            {
                text    : 'Images',
                defaults: { hidden: false },
                menu    : [
                    {
                        text            : 'Upload Image',
                        iconCls         : 'upload-btn',
                        moduleId        : 2081,
                        displayCondition: me.isUploadImageBtnVisible
                    },
                    {
                        text            : 'View Image',
                        displayCondition: me.isManageImagesBtnVisible
                    },
                    {
                        text            : 'Add Image',
                        iconCls         : 'new-btn',
                        moduleId        : 2039,
                        displayCondition: me.isAddImageBtnVisible
                    }
                ]
            }
        ];

    	this.callParent(arguments);
    },

    isSaveBtnVisible: function(data) {
        var invoice_status = data['invoice'].get('invoice_status');

        return (
            (
                (
                    invoice_status == 'open'
                    && (
                        NP.Security.hasPermission(1032)     // New Invoice permission
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
            )
        );
    },

    isDeleteBtnVisible: function(data) {
        var invoice_status = data['invoice'].get('invoice_status');

        return (
            (
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
        return Ext.Array.contains(['open','forapproval','saved'], data['invoice'].get('invoice_status'));
    },

    isVoidBtnVisible: function(data) {
        return (
            data['invoice'].get('invoice_id') !== null
            && !Ext.Array.contains(['hold','void','template','paid'], data['invoice'].get('invoice_status'))
        );
    },

    isApplyTemplateBtnVisible: function(data) {
        return (
            data['invoice'].get('invoice_status') == 'open'
            && (
                NP.Security.hasPermission(2006)     // Invoice User Templates permission
                || NP.Security.hasPermission(2008)  // Invoice Templates permission
            )
        );
    },

    isUseTemplateBtnVisible: function(data) {
        return (
            data['invoice'].get('invoice_status') == 'draft'
            && data['invoice'].getProperty().get('property_status') != -1     // Property is not on hold
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
            && NP.Security.hasPermission(1031)      // Invoices permission
        );
    },

    isRejectBtnVisible: function(data) {
        return (
            data['invoice'].get('invoice_status') == 'forapproval'
            && data['is_approver']
        );
    },

    isManageImagesBtnVisible: function(data) {
        return (data['images'].length > 0);
    },

    isLinkPoBtnVisible: function(data) {
        return (
            data['invoice'].get('invoice_status') == 'open'
            && data['invoice'].get('invoice_id') != null
            && data['has_linkable_pos']
        );
    },

    isPrintBtnVisible: function(data) {
        return Ext.Array.contains(['paid','forapproval','submitted','sent','saved','posted','void'], data['invoice'].get('invoice_status'));
    },

    isForwardBtnVisible: function(data) {
        return (data['invoice'].get('invoice_id') !== null);
    },

    isBudgetReportBtnVisible: function(data) {
        return !Ext.Array.contains(['hold','void'], data['invoice'].get('invoice_status'));
    },

    isSaveTemplateBtnVisible: function(data) {
        return (
            data['invoice'].get('invoice_status') == 'open'
            // TODO: add other conditions here
        ); 
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
        return (
            data['invoice'].get('invoice_status') == 'open'
            && NP.Config.getSetting('pn.main.WebDoczDB', '') != ''
            // TODO: add missing conditions
        );
    }
});