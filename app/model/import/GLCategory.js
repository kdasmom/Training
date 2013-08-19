/**
 * Model for a GLCategory
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.import.GLCategory', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'CategoryName' },
		{ name: 'IntegrationPackage' },
		{ name: 'validation_status' }
	]
});