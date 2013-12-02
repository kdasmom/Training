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
        'NP.lib.core.Translator',
    	'NP.view.shared.Address',
    	'NP.view.shared.Phone',
    	'NP.view.shared.YesNoField',
        'NP.view.shared.CustomField'
    ],

    autoScroll: true,

    initComponent: function() {
        var me = this,
            defaultWidth = 578;

        me.translateText();

    	me.defaults = { labelWidth: 175 };

    	var intPkgStore = Ext.getStore('system.IntegrationPackages').getCopy();
    	intPkgStore.filterBy(function(rec) {
    		return (rec.get('universal_field_status') != 0) ? true : false;
    	});

    	var regionStore = Ext.getStore('property.Regions').getCopy();
    	regionStore.filterBy(function(rec) {
    		return (rec.get('universal_field_status') != 0) ? true : false;
    	});
    	
    	me.items = [
            // Property Code
    		{ xtype: 'textfield', fieldLabel: me.codeFieldText, name: 'property_id_alt', width: defaultWidth, allowBlank: false },
    		// Property AP Code
            { xtype: 'textfield', fieldLabel: me.apCodeFieldText, name: 'property_id_alt_ap', width: defaultWidth},
            // Property Department Code
    		{ xtype: 'textfield', fieldLabel: me.deptCodeFieldText, name: 'property_department_code', width: defaultWidth },
            // Property Name
    		{ xtype: 'textfield', fieldLabel: me.propertyNameFieldText, name: 'property_name', width: defaultWidth, allowBlank: false},
            // Number of Units
    		{ xtype: 'textfield', fieldLabel: me.totalUnitsFieldText, name: 'property_no_units', allowBlank: false },
            // Attention
    		{ xtype: 'textfield', fieldLabel: me.attnFieldText, name: 'address_attn', allowBlank: false, width: defaultWidth },
            // Address
    		{ xtype: 'fieldcontainer', fieldLabel: me.addressFieldText, items: [{ xtype: 'shared.address', showCountry: true, required: true }] },
            // Phone
    		{
    			xtype: 'fieldcontainer',
    			fieldLabel: me.phoneFieldText, 
    			items: [{ xtype: 'shared.phone', showFieldDescriptions: true, hideLabel: true }]
    		},
            // Fax
    		{
    			xtype: 'fieldcontainer',
    			fieldLabel: me.faxFieldText, 
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
    		{ xtype: 'shared.yesnofield', fieldLabel: me.billToFieldText, name: 'property_optionBillAddress' },
            // Default Bill To Property
    		{
                xtype                : 'customcombo',
                fieldLabel           : me.billToPropertyFieldText,
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
    		{ xtype: 'shared.yesnofield', fieldLabel: me.shipToFieldText, name: 'property_optionShipAddress' },
            // Default Ship To Property
    		{
                xtype                : 'customcombo',
                fieldLabel           : me.shipToPropertyFieldText,
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
    		{ xtype: 'shared.yesnofield', fieldLabel: me.syncFieldText, name: 'sync' },
            // Accrual Cash
    		{
    			xtype: 'radiogroup',
    			fieldLabel: me.accrualCashFieldText,
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
    		{ xtype: 'shared.yesnofield', fieldLabel: me.nexusServicesFieldText, name: 'property_NexusServices' },
            // Vendor Catalog
    		{ xtype: 'shared.yesnofield', fieldLabel: me.vendorCatalogFieldText, name: 'property_VendorCatalog' },
            // Integration Package
    		{
                xtype       : 'customcombo',
                fieldLabel  : me.intPackageFieldText,
                name        : 'integration_package_id',
                width       : defaultWidth,
                store       : intPkgStore,
                valueField  : 'integration_package_id',
                displayField: 'integration_package_name',
                allowBlank  : false
    		},
			{
				xtype: 'displayfield',
				fieldLabel  : me.intPackageFieldText,
				name        : 'integration_package_name',
				value: '',
				hidden: true

			},
            // Closing Calendar
    		{
				xtype         : 'customcombo',
				fieldLabel    : me.calendarFieldText,
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
                fieldLabel         : me.volumeTypeFieldText,
                width              : defaultWidth,
                name               : 'property_volume',
                store              : Ext.create('NP.store.property.VolumeTypes'),
                valueField         : 'code',
                displayField       : 'name'
    		}
    	];

        // Add custom fields at the end of the form
        Ext.Array.each(me.customFieldData, function(fieldData) {
            me.items.push({
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

		if (!me.property_id) {
			me.items.push({ xtype: 'displayfield', value: NP.Translator.translate('Accounting Info'), padding: '10 0 0 0'});
			me.items.push({ xtype: 'property.propertiesformaccounting' });
		}

    	me.callParent(arguments);
    },

    translateText: function() {
        var me = this,
            propertyText = NP.Config.getPropertyLabel(),
            unitText     = NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit');

        me.title                   = NP.Translator.translate('{property} Info', { property: propertyText });
        me.codeFieldText           = NP.Translator.translate('{property} Code', { property: propertyText });
        me.apCodeFieldText         = NP.Translator.translate('{property} AP Code', { property: propertyText });
        me.deptCodeFieldText       = NP.Translator.translate('Department Code');
        me.propertyNameFieldText   = NP.Translator.translate('{property} Name', { property: propertyText });
        me.totalUnitsFieldText     = NP.Translator.translate('Total No. of {unit}s', { unit: unitText });
        me.attnFieldText           = NP.Translator.translate('Attention');
        me.addressFieldText        = NP.Translator.translate('Address');
        me.phoneFieldText          = NP.Translator.translate('Phone Number');
        me.faxFieldText            = NP.Translator.translate('Fax Number');
        me.billToFieldText         = NP.Translator.translate('Bill To Address Option');
        me.billToPropertyFieldText = NP.Translator.translate('Default Bill To {property}', { property: propertyText });
        me.shipToFieldText         = NP.Translator.translate('Ship To Address Option');
        me.shipToPropertyFieldText = NP.Translator.translate('Default Ship To {property}', { property: propertyText });
        me.syncFieldText           = NP.Translator.translate('Sync {property}', { property: propertyText });
        me.accrualCashFieldText    = NP.Translator.translate('Accrual or Cash');
        me.nexusServicesFieldText  = NP.Translator.translate('Nexus Services');
        me.vendorCatalogFieldText  = NP.Translator.translate('Vendor Catalog');
        me.intPackageFieldText     = NP.Translator.translate('Integration Package');
        me.calendarFieldText       = NP.Translator.translate('Closing Calendar');
        me.volumeTypeFieldText     = NP.Translator.translate('Volume Type');
    }
});