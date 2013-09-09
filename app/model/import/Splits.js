/**
 * Model for a Splits
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.import.Splits', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'IntegrationPackage' },
		{ name: 'SplitName' },
		{ name: 'VendorCode' },
		{ name: 'PropertyCode' },
		{ name: 'GLCode' },
		{ name: 'Department' },
		{ name: 'CustomField1' },
		{ name: 'CustomField2' },
                { name: 'CustomField3' },
		{ name: 'CustomField4' },
		{ name: 'CustomField5' },
		{ name: 'CustomField6' },
                { name: 'Percent' },
                { name: 'validation_status' },
	]
});