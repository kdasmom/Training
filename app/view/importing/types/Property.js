/**
 * GL Actual import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.Property', {
    extend  : 'NP.view.importing.types.AbstractImportType',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator'
    ],

    fieldName  : 'file_upload_property',

    constructor: function() {
        var me = this;

        me.callParent(arguments);

        me.translateText();
    },

    getGrid: function() {
        return {
            columns: {
                items: [
                    { text: this.colTextPropertyCode, dataIndex: 'property_id_alt' },
                    { text: this.colTextPropertyName, dataIndex: 'property_name' },
                    { text: this.colTextContactName, dataIndex: 'address_attn'},
                    { text: this.colTextAddress1, dataIndex: 'address_line1' },
                    { text: this.colTextAddress2, dataIndex: 'address_line2' },
                    { text: this.colTextCity, dataIndex: 'address_city' },
                    { text: this.colTextState, dataIndex: 'address_state' },
                    { text: this.colTextZip, dataIndex: 'address_zip' },
                    { text: this.colTextPhoneNumber, dataIndex: 'phone_number' },
                    { text: this.colTextFaxNumber, dataIndex: 'fax_number' },
                    { text: this.colTextPropertySalesTax, dataIndex: 'property_salestax' },
                    { text: this.colTextTotalNoUnits, dataIndex: 'property_no_units' },
                    { text: this.colTextRegion, dataIndex: 'region_name' },
                    { text: this.colTextIntegrationPackage, dataIndex: 'integration_package_name' },
                    { text: this.colTextBillToAddressOption, dataIndex: 'property_optionBillAddress' },
                    { text: this.colTextDefaultBillToProperty, dataIndex: 'default_billto_property_id_alt' },
                    { text: this.colTextShipToAddressOption, dataIndex: 'property_optionShipAddress' },
                    { text: this.colTextDefaultShipToProperty, dataIndex: 'default_shipto_property_id_alt' },
                    { text: this.colTextAccrualorCash, dataIndex: 'cash_accural' },
                    { text: this.colTextClosingCalendar, dataIndex: 'fiscalcal_name' },
                    { text: this.colTextFiscalCalendarStartMonth, dataIndex: 'fiscaldisplaytype_name' },
                    { text: this.colTextPOMatchingThreshhold, dataIndex: 'matching_threshold' },
                    { text: this.colTextCustomField1, dataIndex: 'customfielddata_value1' },
                    { text: this.colTextCustomField2, dataIndex: 'customfielddata_value2' },
                    { text: this.colTextCustomField3, dataIndex: 'customfielddata_value3' },
                    { text: this.colTextCustomField4, dataIndex: 'customfielddata_value4' }
                ]
            }
        };
    },

    translateText: function() {
        var me = this,
            propertyText   = NP.Config.getPropertyLabel(),
            propertiesText = NP.Config.getPropertyLabel(true),
            regionText     = NP.Config.getSetting('PN.main.RegionLabel', 'Region'),
            unitText       = NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit'),
            taxText        = NP.Config.getSetting('PN.General.salesTaxTerm', 'Sales Tax');

        me.tabTitle                       = NP.Translator.translate('{property}', { property: propertyText });
        me.entityName                     = NP.Translator.translate('{properties}', { property: propertiesText });
        me.sectionName                    = NP.Translator.translate('{property} Setup', { property: propertyText });
        me.colTextPropertyCode            = NP.Translator.translate('{property} Code', { property: propertyText });
        me.colTextPropertyName            = NP.Translator.translate('{property} Name', { property: propertyText });
        me.colTextContactName             = NP.Translator.translate('Contact Name');
        me.colTextAddress1                = NP.Translator.translate('Address1');
        me.colTextAddress2                = NP.Translator.translate('Address2');
        me.colTextCity                    = NP.Translator.translate('City');
        me.colTextState                   = NP.Translator.translate('State');
        me.colTextZip                     = NP.Translator.translate('Zip');
        me.colTextPhoneNumber             = NP.Translator.translate('Phone Number');
        me.colTextFaxNumber               = NP.Translator.translate('Fax Number');
        me.colTextPropertySalesTax        = NP.Translator.translate('{property} {salesTax}', { property: propertyText, salesTax: taxText });
        me.colTextTotalNoUnits            = NP.Translator.translate('Total No. of {unit}s', { unit: unitText });
        me.colTextRegion                  = NP.Translator.translate('{region}', { region: regionText });
        me.colTextIntegrationPackage      = NP.Translator.translate('Integration Package');
        me.colTextBillToAddressOption     = NP.Translator.translate('Bill To Address Option');
        me.colTextDefaultBillToProperty   = NP.Translator.translate('Default Bill To {property}', { property: propertyText });
        me.colTextShipToAddressOption     = NP.Translator.translate('Ship To Address Option');
        me.colTextDefaultShipToProperty   = NP.Translator.translate('Default Ship To {property}', { property: propertyText });
        me.colTextAccrualorCash           = NP.Translator.translate('Accrual or Cash');
        me.colTextClosingCalendar         = NP.Translator.translate('Closing Calendar');
        me.colTextFiscalCalendarStartMonth= NP.Translator.translate('Fiscal Calendar Start Month');
        me.colTextPOMatchingThreshhold    = NP.Translator.translate('PO Matching Threshhold');
        me.colTextCustomField1            = NP.Translator.translate('Custom Field 1');
        me.colTextCustomField2            = NP.Translator.translate('Custom Field 2');
        me.colTextCustomField3            = NP.Translator.translate('Custom Field 3');
        me.colTextCustomField4            = NP.Translator.translate('Custom Field 4');
    }
});