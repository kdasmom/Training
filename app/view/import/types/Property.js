/**
 * GL Actual import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.Property', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    requires: ['NP.lib.core.Config'],

    fieldName  : 'file_upload_property',

    tabTitle                       : NP.Config.getPropertyLabel(),

    // For localization
    entityName                     : 'Property',
    sectionName                    : 'Property Setup',
    colTextPropertyCode            : 'Property Code',
    colTextPropertyName            : 'Property Name',
    colTextContactName             : 'Contact Name',
    colTextAddress1                : 'Address1',
    colTextAddress2                : 'Address2',
    colTextCity                    : 'City',
    colTextState                   : 'State',
    colTextZip                     : 'Zip',
    colTextPhoneNumber             : 'Phone Number',
    colTextFaxNumber               : 'Fax Number',
    colTextPropertySalesTax        : 'Property Sales Tax',
    colTextTotalNoUnits            : 'Total No Units',
    colTextRegion                  : 'Region',
    colTextIntegrationPackage      : 'Integration Package',
    colTextBillToAddressOption     : 'Bill To Address Option',
    colTextDefaultBillToProperty   : 'Default Bill To Property',
    colTextShipToAddressOption     : 'Ship To Address Option',
    colTextDefaultShipToProperty   : 'Default Ship To Property',
    colTextAccrualorCash           : 'Accrualor Cash',
    colTextClosingCalendar         : 'Closing Calendar',
    colTextFiscalCalendarStartMonth: 'Fiscal Calendar Start Month',
    colTextPOMatchingThreshhold    : 'PO Matching Threshhold',
    colTextCustomField1            : 'Custom Field 1',
    colTextCustomField2            : 'Custom Field 2',
    colTextCustomField3            : 'Custom Field 3',
    colTextCustomField4            : 'Custom Field 4',

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
    }

});