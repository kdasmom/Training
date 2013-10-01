/**
 * @author Baranov A.V.
 * @date 9/30/13
 */


Ext.define('NP.view.mobileSetup.MobileGrid', {
    extend: 'NP.lib.ui.Grid',
    alias: 'widget.mobilesetup.mobilegrid',

    requires: [
        'NP.lib.core.Config',
        'NP.view.shared.button.New',
        'NP.view.shared.button.Activate',
        'NP.view.shared.button.Inactivate',
        'NP.view.shared.button.Delete',
        'NP.view.shared.button.Report'
    ],

    // For localization
    title: 'Mobile Setup',
//    columns
    userColText: 'User',
    userStatusColText: 'User status',
    mobilePhoneColText: 'Mobile phone number',
    deviceStatusColText: 'Device status',
    activeDateColText: 'Active date',
    inactiveDateColText: 'Inactive date',
//    buttons
    mobileReportButtonText: 'Mobile user report',
    mobileCreateNewButtonText: 'Create new',
    activateButtonText: 'Activate',
    inactivateButtonText: 'Inactivate device',
    deleteDeviceButtonText: 'Delete device',


    paging  : true,
    stateful: true,
    stateId : 'mobile_grid',


    initComponent: function() {
        this.pagingToolbarButtons = [
            {
                xtype: 'shared.button.report',
                text: this.mobileReportButtonText,
                hidden: true
            },
            {
                xtype: 'shared.button.new',
                text: this.mobileCreateNewButtonText
            },
            {
                xtype: 'shared.button.activate',
                text: this.activateButtonText,
                disabled: true
            },
            {
                xtype: 'shared.button.inactivate',
                text: this.inactivateButtonText,
                disabled: true
            },
            {
                xtype: 'shared.button.delete',
                text: this.deleteDeviceButtonText,
                disabled: true
            }
        ];

        this.columns = [
            {
                text: this.userColText,
                dataIndex: 'userprofile_username',
                flex: 1,
                renderer: function(val, meta, rec) {
                    var val = rec.raw.person_lastname + ', ' + rec.raw.person_firstname + ' (' + rec.raw.userprofile_username + ')';

                    return val;
                }
            },
            {
                text: this.userStatusColText,
                dataIndex: 'userprofile_status',
                flex: 1,
                renderer: function(val, meta, rec) {
                    var val = rec.raw.userprofile_status;

                    return val;
                }
            },
            {
                text: this.mobilePhoneColText,
                dataIndex: 'mobinfo_phone',
                flex: 1
            },
            {
                text: this.deviceStatusColText,
                dataIndex: 'mobinfo_status',
                flex: 1
            },
            {
                xtype: 'datecolumn',
                text: this.activeDateColText,
                dataIndex: 'mobinfo_activated_datetm',
                flex: 1
            },
            {
                xtype: 'datecolumn',
                text: this.inactiveDateColText,
                dataIndex: 'mobinfo_deactivated_datetm',
                flex: 1
            }
        ];
        this.selModel = Ext.create('Ext.selection.CheckboxModel');
        this.store = Ext.create('NP.store.user.Mobinfos', {
            service    : 'UserService',
            action     : 'findAllMobileInfo',
            paging     : true
        });
        this.callParent(arguments);
    }
});