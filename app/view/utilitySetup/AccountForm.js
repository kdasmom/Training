/**
 * @author Baranov A.V.
 * @date 9/25/13
 */

Ext.define('NP.view.utilitySetup.AccountForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias : 'widget.utilitysetup.accountform',

    requires: [
        'NP.lib.core.Config',
        'NP.view.shared.button.Save',
        'NP.view.shared.button.Cancel',
        'NP.lib.ui.ComboBox',
        'NP.lib.ui.AutoComplete'

    ],

//    for localization
    title                           : 'Utility Account',
    vendorInputLabel                : 'Vendor',
    utilityInputLabel               : 'Utility',
    utilityTypeInputLabel           : 'Utility type',
    accountNumberInputLabel         : 'Account number',
    propertyInputlabel              : 'Property',
    unitInputLabel                  : 'Default unit',
    meterInputLabel                 : 'Meter number',
    glaccountInputLabel             : 'Default GL Account',
    emptyTextForDependedByProperty  : 'Choose property first',


    initComponent: function() {

        var that = this;

        var bar = [
            {
                xtype: 'shared.button.cancel'
            },
            {
                xtype: 'shared.button.save'
            }
        ];
        this.tbar = bar;
        this.bbar = bar;

        this.defaults = {
            labelWidth  : 125,
            padding     : '5',
            width: 500
        };

        this.items = [
            {
                xtype: 'displayfield',
                fieldLabel: this.utilityInputLabel,
                name: 'vendor_name',
                value: 'test'
            },
            {
                xtype: 'customcombo',
                fieldLabel: this.utilityTypeInputLabel,
                name: 'utilityname',
                valueField: 'UtilityType_Id',
                displayField: 'UtilityType'
            },
            {
                xtype: 'textfield',
                fieldLabel: this.accountNumberInputLabel
            },
            {
                xtype: 'customcombo',
                fieldLabel: this.propertyInputlabel
            },
            {
                xtype: 'customcombo',
                fieldLabel: this.unitInputLabel,
                emptyText: this.emptyTextForDependedByProperty
            },
            {
                xtype: 'textfield',
                fieldLabel: this.meterInputLabel
            },
            {
                xtype: 'customcombo',
                fieldLabel: this.glaccountInputLabel,
                emptyText: this.emptyTextForDependedByProperty
            }
        ];



        this.callParent(arguments);
    }/*,

     isValid: function() {
     var isValid = this.callParent(arguments);

     return isValid;
     }*/

});
