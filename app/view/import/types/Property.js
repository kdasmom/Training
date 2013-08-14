/**
 * GL Actual import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.Property', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    requires: ['NP.lib.core.Config'],

    fieldName  : 'file_upload_property',

    // For localization
    tabTitle : NP.Config.getPropertyLabel(),
    entityName          : 'Property',
    sectionName         : 'Property Setup',
    colTextPropertyCode : 'Property Code',
    colTextPropertyName : 'Property Name',
    colTextContactName : 'Contact Name',
    colTextAddress1 : 'Address1',
    colTextAddress2 : 'Address2',
    colTextCity : 'City',
    colTextState : 'State',
    colTextZip : 'Zip',
    colTextPhoneNumber : 'Phone Number',
    colTextFaxNumber : 'Fax Number',
    colTextPropertySalesTax : 'Property Sales Tax',
    colTextTotalNoUnits : 'Total No Units',
    colTextRegion : 'Region',
    colTextIntegrationPackage : 'Integration Package',
    colTextBillToAddressOption : 'Bill To Address Option',
    colTextDefaultBillToProperty : 'Default Bill To Property',
    colTextShipToAddressOption : 'Ship To Address Option',
    colTextDefaultShipToProperty : 'Default Ship To Property',
    colTextAccrualorCash : 'Accrualor Cash',
    colTextClosingCalendar : 'ClosingCalendar',
    colTextFiscalCalendarStartMonth : 'Fiscal Calendar Start Month',
    colTextPOMatchingThreshhold : 'PO Matching Threshhold',
    colTextCustomField1 : 'Custom Field1',
    colTextCustomField2 : 'Custom Field2',
    colTextCustomField3 : 'Custom Field3',
    colTextCustomField4 : 'Custom Field4',
    getGrid: function() {
        return {
            columns: [
                { text: this.colTextPropertyCode, dataIndex: 'PropertyCode', flex: 1 },
                { text: this.colTextPropertyName, dataIndex: 'PropertyName', flex: 1 },
                { text: this.colTextContactName, dataIndex: 'ContactName'},
                { text: this.colTextAddress1, dataIndex: 'StreetAddress1', flex: 1 },
                { text: this.colTextAddress2, dataIndex: 'StreetAddress2', flex: 1 },
                { text: this.colTextCity, dataIndex: 'City', flex: 1 },
                { text: this.colTextState, dataIndex: 'State', flex: 1 },
                { text: this.colTextZip, dataIndex: 'Zip', flex: 1 },
                { text: this.colTextPhoneNumber, dataIndex: 'PhoneNumber', flex: 1 },
                { text: this.colTextFaxNumber, dataIndex: '', flex: 1 },
                { text: this.colTextPropertySalesTax, dataIndex: 'PropertySalesTax', flex: 1 },
                { text: this.colTextTotalNoUnits, dataIndex: '', flex: 1 },
                { text: this.colTextRegion, dataIndex: 'region_id", "dataTable": "Region", "dataColumn": "region_id', flex: 1 },
                { text: this.colTextIntegrationPackage, dataIndex: 'IntegrationPackage", "dataTable": "IntegrationPackage", "dataColumn": "integration_package_name', flex: 1 },
                { text: this.colTextBillToAddressOption, dataIndex: '', flex: 1 },
                { text: this.colTextDefaultBillToProperty, dataIndex: '', flex: 1 },
                { text: this.colTextShipToAddressOption, dataIndex: '', flex: 1 },
                { text: this.colTextDefaultShipToProperty, dataIndex: '', flex: 1 },
                { text: this.colTextAccrualorCash, dataIndex: '', flex: 1 },
                { text: this.colTextClosingCalendar, dataIndex: '', flex: 1 },
                { text: this.colTextFiscalCalendarStartMonth, dataIndex: '', flex: 1 },
                { text: this.colTextPOMatchingThreshhold, dataIndex: '', flex: 1 },
                { text: this.colTextCustomField1, dataIndex: '', flex: 1 },
                { text: this.colTextCustomField2, dataIndex: '', flex: 1 },
                { text: this.colTextCustomField3, dataIndex: '', flex: 1 },
                { text: this.colTextCustomField4, dataIndex: '', flex: 1 },
            ]
        };
    }

});