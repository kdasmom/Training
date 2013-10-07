/**
 * @author Baranov A.V.
 * @date 10/1/13
 */


Ext.define('NP.view.mobileSetup.MobileInfoForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias : 'widget.mobilesetup.mobileinfoform',

    requires: [
        'NP.lib.core.Config',
        'NP.view.shared.button.Save',
        'NP.view.shared.button.Cancel',
        'NP.lib.ui.ComboBox',
        'NP.view.mobileSetup.MobileForm'
    ],

    bind: {
        models: ['user.MobInfo']
    },

    bodyPadding: 8,
    autoScroll : true,

    title: 'Add mobile device',
    userInputLabelText: 'User',
    mobilePhoneNumberInputLabelText: 'Mobile phone number',
    newPinInputLabelText: 'New PIN',
    newPinConfirmInputLabelText: 'Confirm new PIN',

    emptyErrorText: 'cannot be empty',
    incorrectFormatForThePhoneNumber: 'should be numeric and consist of 10 digits.',
    incorrectFormatForThePIN: 'should be numeric and consist of 4 digits.',
    incorrectPintConfirm: 'must be equal with PIN field.',


    initComponent: function() {

        var that = this;

        var bar = [
            { xtype: 'shared.button.cancel' },
            { xtype: 'shared.button.save'}
        ];
        this.tbar = bar;
        this.bbar = bar;

        this.defaults = {
            width     : 500
        };

        this.items = [
            {
                xtype       : 'customcombo',
                fieldLabel  : this.userInputLabelText,
                labelWidth  : 150,
                name        : 'userprofile_id',
                valueField  : 'userprofile_id',
                displayField: 'display_name',
                allowBlank  : false,
                store       : Ext.create('NP.store.user.Userprofiles', {
                    service    : 'UserService',
                    action     : 'getUsersByPermission',
                    extraParams: {
                        module_id_list: 6049
                    },
                    autoLoad   : true
                })
            },
            { xtype: 'mobilesetup.mobileform', defaults: { allowBlank: false } }
        ];

        this.callParent(arguments);
    },

    isValid: function() {
        var me      = this,
            isValid = me.callParent(arguments);

        return isValid && me.query('[xtype="mobilesetup.mobileform"]')[0].isValid();
    }

});