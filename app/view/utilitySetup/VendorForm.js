/**
 * @author Baranov A.V.
 * @date 9/23/13
 */

Ext.define('NP.view.utilitySetup.VendorForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias : 'widget.utilitysetup.vendorform',

    requires: [
        'NP.lib.core.Config',
        'NP.view.shared.button.Save',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Delete',
        'NP.lib.ui.ComboBox'
    ],

    bodyPadding: 8,
    autoScroll : true,

    title: 'New Vendor',
    vendorNameInputLabel: 'Vendor name',
    utilityTypeInputLabel: 'Utility type',
    contactPersonInputLabel: 'Contact person',
    contactPersonFirstnameLabel: 'Firstname',
    contactPersonMiddlenameLabel: 'Middle',
    contactPersonLastnameLabel: 'Last name',
    contactPhoneInputLabel: 'Contact phone',
    contactPhoneBaseLabel: 'Phone',
    contactPhoneExtLabel: 'Ext',
    emptyErrorText: 'cannot be empty',
    lessZeroErrorText: 'cannot be less the zero',

    initComponent: function() {
        var bar = [
            { xtype: 'shared.button.cancel' },
            { xtype: 'shared.button.delete', hidden: true },
            { xtype: 'shared.button.save'}
        ];
        this.tbar = bar;
        this.bbar = bar;

        this.defaults = {
            labelWidth: 125
        };

        this.items = [
            {
                xtype           : 'fieldcontainer',
                fieldLabel      : this.contactPersonInputLabel,
                layout          : 'hbox',
                items           : [
                    {
                        xtype: 'textfield',
                        fieldLabel: this.contactPersonFirstnameLabel,
                        name:   ''
                    }
                ]
            }
        ];



        this.callParent(arguments);
    },

    isValid: function() {
        var isValid = this.callParent(arguments);

        return isValid;
    }

});
