/**
 * Model for a Property
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.import.Property', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'PropertyCode' },
		{ name: 'PropertyName' },
		{ name: 'ContactName' },
		{ name: 'Address1' },
		{ name: 'Address2' },
		{ name: 'City' },
		{ name: 'State' },
		{ name: 'Zip' },
		{ name: 'PhoneNumber' },
                { name: 'FaxNumber' },
		{ name: 'PropertySalesTax' },
                { name: 'TotalNoUnits' },
		{ name: 'Region' },
		{ name: 'IntegrationPackage' },
		{ name: 'BillToAddressOption' },
		{ name: 'DefaultBillToProperty' },
		{ name: 'ShipToAddressOption' },
		{ name: 'DefaultShipToProperty' },
		{ name: 'AccrualorCash' },
		{ name: 'ClosingCalendar' },
		{ name: 'FiscalCalendarStartMonth' },
		{ name: 'POMatchingThreshhold' },
		{ name: 'CustomField1' },
		{ name: 'CustomField2' },
                { name: 'CustomField3' },
		{ name: 'CustomField4' },
                { name: 'validation_status' },
	],

	validations: [
		{ field: 'PropertyCode', type: 'length', max: 10 },
		{ field: 'PropertyName', type: 'length', max: 255 },
		{ field: 'ContactName', type: 'length', max: 255 },
		{ field: 'Address1', type: 'length', max: 255 },
		{ field: 'Address2', type: 'length', max: 255 },
		{ field: 'City', type: 'length', max: 100 },
		{ field: 'State', type: 'length', max: 2 },
		{ field: 'Zip', type: 'length', max: 5 },
		{ field: 'PhoneNumber', type: 'length', max: 12 },
                { field: 'FaxNumber', type: 'length', max: 12 },
                { field: 'PropertySalesTax', type: 'length', max: 5 },
		{ field: 'TotalNoUnitss', type: 'length', max: 10 },
		{ field: 'Region', type: 'length', max: 250 },
		{ field: 'IntegrationPackage', type: 'length', max: 50 },
		{ field: 'BillToAddressOption', type: 'length', max: 3 },
		{ field: 'DefaultBillToProperty', type: 'length', max: 255 },
		{ field: 'ShipToAddressOption', type: 'length', max: 3 },
		{ field: 'DefaultShipToProperty', type: 'length', max: 3 },
		{ field: 'AccrualorCash', type: 'length', max: 7 },
		{ field: 'ClosingCalendar', type: 'length', max: 255 },
		{ field: 'FiscalCalendarStartMonth', type: 'length', max: 255 },
		{ field: 'POMatchingThreshhold', type: 'length', max: 255 },
	]
});