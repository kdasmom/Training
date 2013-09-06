/**
 * Model for a VendorUtility
 *
 * @author Yura Rodchyn
 */
Ext.define('NP.model.import.Vendor', {
	extend: 'Ext.data.Model',
	
	fields: [
        {"name": "Vendor ID"},
        {"name": "Name"},
        {"name": "Federal ID"},
        {"name": "Tax Report Name"},
        {"name": "Status"},
        {"name": "Vendor Type"},
        {"name": "Pay Priority"},
        {"name": "Created Date"},
        {"name": "Last Update Date"},
        {"name": "1099 Reportable?"},
        {"name": "Term Date Basis"},
        {"name": "Pay Date Basis"},
        {"name": "Default GL code"},
        {"name": "Phone"},
        {"name": "Fax"},
        {"name": "Address 1"},
        {"name": "Address 2"},
        {"name": "City"},
        {"name": "State"},
        {"name": "Zip Code"},
        {"name": "Contact Last Name"},
        {"name": "Contact First Name"},
        {"name": "Integration Package"}
	]
});
