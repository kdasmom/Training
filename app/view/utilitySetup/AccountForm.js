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
        'NP.lib.ui.AutoComplete',
        'NP.view.shared.PropertyCombo'

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
    emptyErrorText: 'cannot be empty',


    initComponent: function() {

        var that = this;

        var bar = [
            {
                xtype: 'shared.button.cancel'
            },
            {
                xtype: 'shared.button.save'
            },
            {
                xtype: 'shared.button.delete',
                hidden: true
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
                name: 'UtilityType_Id',
                valueField: 'UtilityType_Id',
                displayField: 'UtilityType'
            },
            {
                xtype: 'textfield',
                fieldLabel: this.accountNumberInputLabel,
                name: 'UtilityAccount_AccountNumber'
            },
            {
                xtype                   : 'shared.propertycombo',
                fieldLabel              : this.propertyInputlabel,
                loadStoreOnFirstQuery   : true,
                name                    : 'property_id',
                listeners: {
                    select: function(combo, records, eOpts) {
                        that.fireEvent('selectproperty', combo, records, eOpts);
                    }
                }
            },
            {
                xtype: 'customcombo',
                fieldLabel: this.unitInputLabel,
                emptyText: this.emptyTextForDependedByProperty,
                name: 'unit_id',
                displayField: 'unit_number',
                valueField: 'unit_id',
                queryMode       : 'local',
                autoSelect      : true,
                forceselection  : true
            },
            {
                xtype: 'textfield',
                fieldLabel: this.meterInputLabel,
                name: 'UtilityAccount_MeterSize'
            },
            {
                xtype: 'customcombo',
                fieldLabel: this.glaccountInputLabel,
                emptyText: this.emptyTextForDependedByProperty,
                name: 'glaccount_id',
                displayField: 'glaccount_name',
                valueField: 'glaccount_id',
                queryMode       : 'local',
                autoSelect      : true,
                forceselection  : true
            }
        ];



        this.callParent(arguments);
        this.addEvents('selectproperty');
    },

     isValid: function() {
         var isValid = this.callParent(arguments);

         propertyInput = this.findField('property_id');
         utilityTypeInput = this.findField('UtilityType_Id');
         accountNumberInput = this.findField('UtilityAccount_AccountNumber');
         metersizeInput = this.findField('UtilityAccount_MeterSize');

         if (propertyInput.getValue() == null) {
             isValid = false;
             propertyInput.markInvalid(this.propertyInputlabel + ' ' + this.emptyErrorText);
         }
         if (utilityTypeInput.getValue() == null) {
             isValid = false;
             utilityTypeInput.markInvalid(this.utilityTypeInputLabel + ' ' + this.emptyErrorText);
         }
         if (accountNumberInput.getValue() == '') {
             isValid = false;
             accountNumberInput.markInvalid(this.accountNumberInputLabel + ' ' + this.emptyErrorText);
         }
         if (metersizeInput.getValue() == '') {
             isValid = false;
             metersizeInput.markInvalid(this.meterInputLabel + ' ' + this.emptyErrorText);
         }

         return isValid;
     }

});
