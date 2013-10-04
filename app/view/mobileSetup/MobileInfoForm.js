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
        'NP.lib.ui.ComboBox'
    ],

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
            labelWidth: 200,
            width: 500
        };

        this.items = [
            {
                xtype           : 'combo',
                fieldLabel      : this.userInputLabelText,
                name            : 'username',
                store       : Ext.create('NP.store.user.Userprofiles', {
                    service           : 'UserService',
                    action            : 'getAll',
                    autoLoad          : true
                }),
                tpl         : '<tpl for="."><div class="x-boundlist-item">{userprofilerole.staff.person.person_lastname}, {userprofilerole.staff.person.person_firstname} ({userprofile_username})</div></tpl>',
                valueField      : 'userprofile_id',
                displayName     : 'userprofile_id',
                listeners: {
                    select: function(combo, record, index) {
                        var userprofile = record[0].get('userprofilerole');
                        var name = userprofile.staff.person.person_lastname + ',' + userprofile.staff.person.person_firstname + ' (' + record[0].get('userprofile_username') + ')';
                        that.findField('userprofile_id').setValue(combo.getValue());
                        combo.setValue(name);
                    }
                }
            },
            {
                xtype: 'textfield',
                fieldLabel: this.mobilePhoneNumberInputLabelText,
                name: 'mobinfo_phone'

            },
            {
                xtype: 'textfield',
                fieldLabel: this.newPinInputLabelText,
                name: 'mobinfo_pin'

            },
            {
                xtype: 'textfield',
                fieldLabel: this.newPinConfirmInputLabelText,
                name: 'mobinfo_pin_confirm'

            },
            {
                xtype: 'hiddenfield',
                name: 'userprofile_id'
            }
        ];

        this.callParent(arguments);
    },

    isValid: function() {
        var isValid = this.callParent(arguments);

        var userInput = this.findField('userprofile_id');
        var phone = this.findField('mobinfo_phone');
        var pin = this.findField('mobinfo_pin');
        var pinconfirm = this.findField('mobinfo_pin_confirm');

        if (userInput.getValue() == null) {
            isValid = false;
            userInput.markInvalid(this.userInputLabelText + ' ' + this.emptyErrorText);
        }
        var pattern = /^\d{10}$/;
        if (pattern.exec(phone.getValue()) == null) {
            isValid = false;
            phone.markInvalid(this.mobilePhoneNumberInputLabelText + ' ' + this.incorrectFormatForThePhoneNumber);
        }
        pattern =/^\d{4}$/;
        if (pattern.exec(pin.getValue()) == null) {
            isValid = false;
            pin.markInvalid(this.newPinInputLabelText + ' ' + this.incorrectFormatForThePIN);
        }

        if (pin.getValue() !== pinconfirm.getValue()) {
            isValid = false;
            pinconfirm.markInvalid(this.newPinConfirmInputLabelText + ' ' + this.incorrectPintConfirm);
        }

        console.log('form: ', this.getValues());
        return isValid;
    }

});