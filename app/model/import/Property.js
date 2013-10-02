/**
 * Model for a Property
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.import.Property', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'property_id_alt' },
		{ name: 'property_name' },
		{ name: 'address_attn' },
		{ name: 'address_line1' },
		{ name: 'address_line2' },
		{ name: 'address_city' },
		{ name: 'address_state' },
		{ name: 'address_zip' },
		{ name: 'phone_number' },
        { name: 'fax_number' },
		{ name: 'property_salestax' },
        { name: 'property_no_units' },
		{ name: 'region_name' },
		{ name: 'integration_package_name' },
		{ name: 'property_optionBillAddress' },
		{ name: 'default_billto_property_id_alt' },
		{ name: 'property_optionShipAddress' },
		{ name: 'default_shipto_property_id_alt' },
		{ name: 'cash_accural' },
		{ name: 'fiscalcal_name' },
		{ name: 'fiscaldisplaytype_name' },
		{ name: 'matching_threshold' },
		{ name: 'customfielddata_value1' },
		{ name: 'customfielddata_value2' },
        { name: 'customfielddata_value3' },
		{ name: 'customfielddata_value4' },
        { name: 'validation_status' },
        { name: 'validation_errors' }
	]
});