/**
 * Model for a Property
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.import.Property', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'PropertyCode' },
		{ name: 'PropertyAPCode' },
		{ name: 'DepartmentCode' },
		{ name: 'PropertyName' },
		{ name: 'SquareFeet' },
		{ name: 'ContactName' },
		{ name: 'StreetAddress1' },
		{ name: 'StreetAddress2' },
		{ name: 'City' },
		{ name: 'State' },
		{ name: 'Zip' },
		{ name: 'PhoneNumber' },
		{ name: 'Region' },
		{ name: 'AccountingMethod' },
		{ name: 'PropertySalesTax' },
		{ name: 'POMatchingThreshold' },
		{ name: 'ClosingCalendarName' },
		{ name: 'FiscalCalendar' },
		{ name: 'IntegrationPackage' },
		{ name: 'RowID', type: 'int' },
		{ name: 'user_id', type: 'int' },
		{ name: 'region_id', type: 'int' },
		{ name: 'integration_package_id', type: 'int' },
		{ name: 'fiscaldisplaytype_value', type: 'int' },
		{ name: 'ClosingCalendarYear', type: 'int' },
		{ name: 'cash_accural_typo' }
	],

	validations: [
		{ field: 'PropertyCode', type: 'length', max: 10 },
		{ field: 'PropertyAPCode', type: 'length', max: 10 },
		{ field: 'DepartmentCode', type: 'length', max: 10 },
		{ field: 'PropertyName', type: 'length', max: 255 },
		{ field: 'SquareFeet', type: 'length', max: 50 },
		{ field: 'ContactName', type: 'length', max: 255 },
		{ field: 'StreetAddress1', type: 'length', max: 255 },
		{ field: 'StreetAddress2', type: 'length', max: 255 },
		{ field: 'City', type: 'length', max: 100 },
		{ field: 'State', type: 'length', max: 2 },
		{ field: 'Zip', type: 'length', max: 5 },
		{ field: 'PhoneNumber', type: 'length', max: 12 },
		{ field: 'Region', type: 'length', max: 250 },
		{ field: 'AccountingMethod', type: 'length', max: 1 },
		{ field: 'ClosingCalendarName', type: 'length', max: 255 },
		{ field: 'FiscalCalendar', type: 'length', max: 255 },
		{ field: 'IntegrationPackage', type: 'length', max: 50 },
		{ field: 'cash_accural_typo', type: 'length', max: 10 }
	]
});