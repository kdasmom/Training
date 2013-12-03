/**
 * Model for a Property
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.property.Property', {
    extend: 'Ext.data.Model',
    
    requires: [
        'NP.lib.core.Config',
        'NP.model.system.IntegrationPackage',
        'NP.model.property.Region',
        'NP.model.user.Userprofile',
        'NP.lib.data.JsonFlat'
    ],

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
        { name: 'property_fiscal_year', type: 'date' },
        { name: 'property_account_month', type: 'int' },
        { name: 'property_closing_day', type: 'int' },
        { name: 'property_account_method' },
        { name: 'second_property_code' },
        { name: 'second_company_code' },
        { name: 'company_id_alt' },
        { name: 'fixedasset_account' },
        { name: 'matching_threshold', type: 'float', defaultValue: 0 },
        { name: 'property_status', type: 'int', defaultValue: -1 },
        { name: 'property_download' },
        { name: 'region_id', type: 'int' },
        { name: 'integration_package_id', type: 'int' },
        { name: 'sync', type: 'int', defaultValue: 1 },
        { name: 'fiscaldisplaytype_value', type: 'int', defaultValue: 1 },
        { name: 'cash_accural', defaultValue: 'accural' },
        { name: 'UserProfile_ID', type: 'int' },
        { name: 'createdatetm', type: 'date' },
        { name: 'property_optionBillAddress', type: 'int', defaultValue: 1 },
        { name: 'property_optionShipAddress', type: 'int', defaultValue: 1 },
        { name: 'default_billto_property_id', type: 'int' },
        { name: 'default_shipto_property_id', type: 'int' },
        { name: 'property_volume', defaultValue: 'normal' },
        { name: 'last_updated_datetm', type: 'date' },
        { name: 'last_updated_by', type: 'int' },
        { name: 'property_NexusServices', type: 'int', defaultValue: 1 },
        { name: 'property_VendorCatalog', type: 'int', defaultValue: 1 }
    ],

    belongsTo: [
        {
            model         : 'NP.model.system.IntegrationPackage',
            name          : 'integrationPackage',
            getterName    : 'getIntegrationPackage',
            foreignKey    : 'integration_package_id',
            primaryKey    : 'integration_package_id',
            reader        : 'jsonflat'
        },
        {
            model         : 'NP.model.property.Region',
            name          : 'region',
            getterName    : 'getRegion',
            foreignKey    : 'region_id',
            primaryKey    : 'region_id',
            reader        : 'jsonflat'
        },{
            model         : 'NP.model.user.Userprofile',
            name          : 'createdByUser',
            getterName    : 'getCreatedByUser',
            foreignKey    : 'UserProfile_ID',
            primaryKey    : 'userprofile_id',
            prefix        : 'created_by_',
            reader        : 'jsonflat'
        },{
            model         : 'NP.model.user.Userprofile',
            name          : 'updatedByUser',
            getterName    : 'getUpdatedByUser',
            foreignKey    : 'UserProfile_ID',
            primaryKey    : 'userprofile_id',
            prefix        : 'updated_by_',
            reader        : 'jsonflat'
        }
    ]
});