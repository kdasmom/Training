/**
 * Model for a Vendor import
 *
 * @author Yura Rodchyn
 */
Ext.define('NP.model.import.Vendor', {
    extend: 'Ext.data.Model',
    fields: [
        { name: "vendor_id_alt" },
        { name: "vendor_name" },
        { name: "vendor_fedid" },
        { name: "vendor_tax_reporting_name" },
        { name: "vendor_status" },
        { name: "vendortype_name" },
        { name: "vendor_paypriority" },
        { name: "vendor_createddatetm" },
        { name: "vendor_lastupdate_date" },
        { name: "vendor_type1099" },
        { name: "vendor_termsdatebasis" },
        { name: "paydatebasis_code" },
        { name: "default_glaccount_number" },
        { name: "phone_number" },
        { name: "fax_number" },
        { name: "address_line1" },
        { name: "address_line2" },
        { name: "address_city" },
        { name: "address_state" },
        { name: "address_zip" },
        { name: "person_lastname" },
        { name: "person_firstname" },
        { name: "integration_package_name" },
        { name: "validation_status" },
        { name: "validation_errors" }
    ]
});
