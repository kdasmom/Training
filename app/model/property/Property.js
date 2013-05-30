/**
 * Model for a Property
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.property.Property', {
    extend: 'NP.lib.data.Model',
    
    requires: ['NP.lib.core.Config'],

    idProperty: 'property_id',
    fields: [
        { name: 'property_id', type: 'int' },
        { name: 'property_id_alt' },
        { name: 'property_id_alt_ap' },
        { name: 'property_department_code' },
        { name: 'company_id', type: 'int' },
        { name: 'property_name' },
        { name: 'property_salestax', type: 'float', defaultValue: 0 },
        { name: 'property_no_units' },
        { name: 'property_fiscal_year', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
        { name: 'property_account_month', type: 'int' },
        { name: 'property_closing_day', type: 'int' },
        { name: 'property_account_method' },
        { name: 'second_property_code' },
        { name: 'second_company_code' },
        { name: 'company_id_alt' },
        { name: 'fixedasset_account' },
        { name: 'matching_threshold', type: 'float', defaultValue: 0 },
        { name: 'property_status', type: 'int' },
        { name: 'property_download' },
        { name: 'region_id', type: 'int' },
        { name: 'integration_package_id', type: 'int' },
        { name: 'sync', type: 'int', defaultValue: 1 },
        { name: 'fiscaldisplaytype_value', type: 'int', defaultValue: 1 },
        { name: 'cash_accural', defaultValue: 'accural' },
        { name: 'UserProfile_ID', type: 'int' },
        { name: 'createdatetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
        { name: 'property_optionBillAddress', type: 'int', defaultValue: 1 },
        { name: 'property_optionShipAddress', type: 'int', defaultValue: 1 },
        { name: 'default_billto_property_id', type: 'int' },
        { name: 'default_shipto_property_id', type: 'int' },
        { name: 'property_volume', defaultValue: 'normal' },
        { name: 'last_updated_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
        { name: 'last_updated_by', type: 'int' },
        { name: 'property_NexusServices', defaultValue: 1 },
        { name: 'property_VendorCatalog', defaultValue: 1 }
    ],

    validations: [
        { field: 'property_id_alt', type: 'length', max: 50 },
        { field: 'property_id_alt_ap', type: 'length', max: 50 },
        { field: 'property_department_code', type: 'length', max: 10 },
        { field: 'property_name', type: 'length', max: 255 },
        { field: 'property_no_units', type: 'length', max: 50 },
        { field: 'property_account_method', type: 'length', max: 50 },
        { field: 'second_property_code', type: 'length', max: 10 },
        { field: 'second_company_code', type: 'length', max: 10 },
        { field: 'company_id_alt', type: 'length', max: 10 },
        { field: 'fixedasset_account', type: 'length', max: 50 },
        { field: 'cash_accural', type: 'length', max: 10 },
        { field: 'property_volume', type: 'length', max: 15 }
    ]
});