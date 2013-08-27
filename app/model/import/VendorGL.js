/**
 * Model for a VendorUtility
 *
 * @author Yura Rodchyn
 */
Ext.define('NP.model.import.VendorGL', {
	extend: 'Ext.data.Model',
	
	fields: [
        {"name": "VendorCode"},
        {"name": "GLCodes"},
        {"name": "Integration Package"}
	]
});
