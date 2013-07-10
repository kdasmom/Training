/**
 * Vertical tab in Property Setup > Properties > Add/Edit form > Property Info tab
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.PropertiesFormInfo', {
    extend: 'Ext.container.Container',
    alias: 'widget.property.propertiesforminfo',
    
    requires: [
    	'NP.lib.core.Config',
    	'NP.view.shared.Address',
    	'NP.view.shared.Phone',
    	'NP.view.shared.YesNoField',
        'NP.view.shared.CustomField'
    ],

    autoScroll: true,

    title                  : NP.Config.getPropertyLabel() + ' Info',
    codeFieldText          : NP.Config.getPropertyLabel() + ' Code',
    apCodeFieldText        : NP.Config.getPropertyLabel() + ' AP Code',
    deptCodeFieldText      : 'Department Code',
    propertyNameFieldText  : NP.Config.getPropertyLabel() + ' Name',
    totalUnitsFieldText    : 'Total No. of ' + NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit') + 's',
    attnFieldText          : 'Attention',
    addressFieldText       : 'Address',
    phoneFieldText         : 'Phone Number',
    faxFieldText           : 'Fax Number',
    billToFieldText        : 'Bill To Address Option',
    billToPropertyFieldText: 'Default Bill To Property',
    shipToFieldText        : 'Ship To Address Option',
    shipToPropertyFieldText: 'Default Ship To Property',
    syncFieldText          : 'Sync ' + NP.Config.getPropertyLabel(),
    accrualCashFieldText   : 'Accrual or Cash',
    nexusServicesFieldText : 'Nexus Services',
    vendorCatalogFieldText : 'Vendor Catalog',
    intPackageFieldText    : 'Integration Package',
    calendarFieldText      : 'Closing Calendar',
    volumeTypeFieldText    : 'Volume Type',

    initComponent: function() {
        var that = this;
        var defaultWidth = 578;

    	this.defaults = { labelWidth: 175 };

    	var intPkgStore = Ext.getStore('system.IntegrationPackages').getCopy();
    	intPkgStore.filterBy(function(rec) {
    		return (rec.get('universal_field_status') != 0) ? true : false;
    	});

    	var regionStore = Ext.getStore('property.Regions').getCopy();
    	regionStore.filterBy(function(rec) {
    		return (rec.get('universal_field_status') != 0) ? true : false;
    	});
    	
    	this.items = [
            // Property Code
    		{ xtype: 'textfield', fieldLabel: this.codeFieldText, name: 'property_id_alt', width: defaultWidth, allowBlank: false },
    		// Property AP Code
            { xtype: 'textfield', fieldLabel: this.apCodeFieldText, name: 'property_id_alt_ap', width: defaultWidth },
            // Property Department Code
    		{ xtype: 'textfield', fieldLabel: this.deptCodeFieldText, name: 'property_department_code', width: defaultWidth },
            // Property Name
    		{ xtype: 'textfield', fieldLabel: this.propertyNameFieldText, name: 'property_name', width: defaultWidth, allowBlank: false },
            // Number of Units
    		{ xtype: 'textfield', fieldLabel: this.totalUnitsFieldText, name: 'property_no_units', allowBlank: false },
            // Attention
    		{ xtype: 'textfield', fieldLabel: this.attnFieldText, name: 'address_attn', allowBlank: false, width: defaultWidth },
            // Address
    		{ xtype: 'fieldcontainer', fieldLabel: this.addressFieldText, items: [{ xtype: 'shared.address', showCountry: true, required: true }] },
            // Phone
    		{
    			xtype: 'fieldcontainer',
    			fieldLabel: this.phoneFieldText, 
    			items: [{ xtype: 'shared.phone', showFieldDescriptions: true, hideLabel: true }]
    		},
            // Fax
    		{
    			xtype: 'fieldcontainer',
    			fieldLabel: this.faxFieldText, 
    			items: [{ xtype: 'shared.phone', prefix: 'fax_', showFieldDescriptions: true, hideLabel: true }]
    		},
            // Region
    		{
                xtype       : 'customcombo',
                fieldLabel  : NP.Config.getSetting('PN.main.RegionLabel', 'Region'),
                name        : 'region_id',
                store       : regionStore,
                valueField  : 'region_id',
                displayField: 'region_name',
                width       : defaultWidth,
                allowBlank  : false
    		},
            // Bill To Address Option
    		{ xtype: 'shared.yesnofield', fieldLabel: this.billToFieldText, name: 'property_optionBillAddress' },
            // Default Bill To Property
    		{
                xtype                : 'customcombo',
                fieldLabel           : this.billToPropertyFieldText,
                name                 : 'default_billto_property_id',
                hidden               : true,
                width                : defaultWidth,
                valueField           : 'property_id',
                displayField         : 'property_name',
                loadStoreOnFirstQuery: true,
                store                : Ext.create('NP.store.property.Properties', {
					service: 'PropertyService',
					action : 'getBillToShipToProperties',
					extraParams: {
						type: 'bill'
					}
				})
    		},
            // Ship To Address Option
    		{ xtype: 'shared.yesnofield', fieldLabel: this.shipToFieldText, name: 'property_optionShipAddress' },
            // Default Ship To Property
    		{
                xtype                : 'customcombo',
                fieldLabel           : this.shipToPropertyFieldText,
                name                 : 'default_shipto_property_id',
                hidden               : true,
                width                : defaultWidth,
                valueField           : 'property_id',
                displayField         : 'property_name',
                loadStoreOnFirstQuery: true,
                store                : Ext.create('NP.store.property.Properties', {
					service: 'PropertyService',
					action : 'getBillToShipToProperties',
					extraParams: {
						type: 'ship'
					}
				})
    		},
            // Sync
    		{ xtype: 'shared.yesnofield', fieldLabel: this.syncFieldText, name: 'sync' },
            // Accrual Cash
    		{
    			xtype: 'radiogroup',
    			fieldLabel: this.accrualCashFieldText,
    			defaults: {
    				name: 'cash_accural',
    				style: 'white-space: nowrap;margin-right:12px;'
    			},
    			items: [
		    		{ boxLabel: 'Accrual', inputValue: 'accural', checked: true },
		    		{ boxLabel: 'Cash', inputValue: 'cash' }
		    	]
    		},
            // Nexus Services
    		{ xtype: 'shared.yesnofield', fieldLabel: this.nexusServicesFieldText, name: 'property_NexusServices' },
            // Vendor Catalog
    		{ xtype: 'shared.yesnofield', fieldLabel: this.vendorCatalogFieldText, name: 'property_VendorCatalog' },
            // Integration Package
    		{
                xtype       : 'customcombo',
                fieldLabel  : this.intPackageFieldText,
                name        : 'integration_package_id',
                width       : defaultWidth,
                store       : intPkgStore,
                valueField  : 'integration_package_id',
                displayField: 'integration_package_name',
                allowBlank  : false
    		},
            // Closing Calendar
    		{
				xtype         : 'customcombo',
				fieldLabel    : this.calendarFieldText,
				name          : 'fiscalcal_id',
				store         : Ext.create('NP.store.property.FiscalCals', {
					service: 'PropertyService',
					action : 'getMasterClosingCalendars'
				}),
                width            : defaultWidth,
				selectFirstRecord: true,
                allowBlank       : false,
				valueField       : 'fiscalcal_id',
				displayField     : 'fiscalcal_name'
    		},
            // Volume Type
    		{
                xtype              : 'customcombo',
                fieldLabel         : this.volumeTypeFieldText,
                width              : defaultWidth,
                name               : 'property_volume',
                store              : Ext.create('NP.store.property.VolumeTypes'),
                valueField         : 'code',
                displayField       : 'name'
    		}
    	];

        // Add custom fields at the end of the form
        Ext.Array.each(this.customFieldData, function(fieldData) {
            that.items.push({
                xtype     : 'shared.customfield',
                fieldLabel: fieldData['customfield_label'],
                entityType: fieldData['customfield_pn_type'],
                type      : fieldData['customfield_type'],
                name      : fieldData['customfield_name'],
                number    : fieldData['universal_field_number'],
                allowBlank: !fieldData['customfield_required'],
                fieldCfg  : { width: defaultWidth-177, value: fieldData['customfielddata_value'] }
            });
        });

    	this.callParent(arguments);
    }
});