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
                text: this.mobileReportButtonText
            },
            {
                xtype: 'shared.button.new',
                text: this.mobileCreateNewButtonText
            },
            {
                xtype: 'shared.button.activate',
                text: this.activateButtonText
            },
            {
                xtype: 'shared.button.inactivate',
                text: this.inactivateButtonText
            },
            {
                xtype: 'shared.button.delete',
                text: this.deleteDeviceButtonText
            }
        ];

        this.columns = [
            {
                text: this.userColText,
                dataIndex: 'username',
                flex: 1
            },
            {
                text: this.userStatusColText,
                dataIndex: 'user_status',
                flex: 1
            },
            {
                text: this.mobilePhoneColText,
                dataIndex: 'mobile_phone',
                flex: 1
            },
            {
                text: this.deviceStatusColText,
                dataIndex: 'device_status',
                flex: 1
            },
            {
                text: this.activeDateColText,
                dataIndex: 'active_date',
                flex: 1
            },
            {
                text: this.inactiveDateColText,
                dataIndex: 'inactive_date',
                flex: 1
            }
        ];

        this.store = [];

        this.callParent(arguments);
    }
});