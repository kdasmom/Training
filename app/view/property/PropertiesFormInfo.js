/**
 * Vertical tab in Property Setup > Properties > Add/Edit form 
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
    	'NP.view.shared.YesNoField'
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
    		{ xtype: 'textfield', fieldLabel: this.codeFieldText, name: 'property_id_alt' },
    		{ xtype: 'textfield', fieldLabel: this.apCodeFieldText, name: 'property_id_alt_ap' },
    		{ xtype: 'textfield', fieldLabel: this.deptCodeFieldText, name: 'property_department_code' },
    		{ xtype: 'textfield', fieldLabel: this.propertyNameFieldText, name: 'property_name' },
    		{ xtype: 'textfield', fieldLabel: this.totalUnitsFieldText, name: 'property_no_units' },
    		{ xtype: 'textfield', fieldLabel: this.attnFieldText, name: 'address_attn' },
    		{ xtype: 'fieldcontainer', fieldLabel: this.addressFieldText, items: [{ xtype: 'shared.address', showCountry: true }] },
    		{
    			xtype: 'fieldcontainer',
    			fieldLabel: this.phoneFieldText, 
    			items: [{ xtype: 'shared.phone', showFieldDescriptions: true, hideLabel: true }]
    		},
    		{
    			xtype: 'fieldcontainer',
    			fieldLabel: this.faxFieldText, 
    			items: [{ xtype: 'shared.phone', prefix: 'fax_', showFieldDescriptions: true, hideLabel: true }]
    		},
    		{
				xtype         : 'combo',
				fieldLabel    : NP.Config.getSetting('PN.main.RegionLabel', 'Region'),
				queryMode     : 'local',
				forceSelection: true,
				name          : 'region_id',
				store         : regionStore,
				valueField    : 'region_id',
				displayField  : 'region_name'
    		},
    		{ xtype: 'shared.yesnofield', fieldLabel: this.billToFieldText, name: 'property_optionBillAddress' },
    		{
				xtype       : 'combo',
				fieldLabel  : this.billToPropertyFieldText,
				name        : 'default_billto_property_id',
				hidden      : true,
				store       : Ext.create('NP.store.property.Properties', {
					service: 'PropertyService',
					action : 'getBillToShipToProperties',
					extraParams: {
						type: 'bill'
					}
				}),
				valueField  : 'property_id',
				displayField: 'property_name'
    		},
    		{ xtype: 'shared.yesnofield', fieldLabel: this.shipToFieldText, name: 'property_optionShipAddress' },
    		{
				xtype       : 'combo',
				fieldLabel  : this.shipToPropertyFieldText,
				name        : 'default_shipto_property_id',
				hidden      : true,
				store       : Ext.create('NP.store.property.Properties', {
					service: 'PropertyService',
					action : 'getBillToShipToProperties',
					extraParams: {
						type: 'ship'
					}
				}),
				valueField  : 'property_id',
				displayField: 'property_name'
    		},
    		{ xtype: 'shared.yesnofield', fieldLabel: this.syncFieldText, name: 'sync' },
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
    		{ xtype: 'shared.yesnofield', fieldLabel: this.nexusServicesFieldText, name: 'property_NexusServices' },
    		{ xtype: 'shared.yesnofield', fieldLabel: this.vendorCatalogFieldText, name: 'property_VendorCatalog' },
    		{
				xtype         : 'combo',
				fieldLabel    : this.intPackageFieldText,
				queryMode     : 'local',
				forceSelection: true,
				name          : 'integration_package_id',
				store         : intPkgStore,
				valueField    : 'integration_package_id',
				displayField  : 'integration_package_name'
    		},
    		{
				xtype         : 'customcombo',
				fieldLabel    : this.calendarFieldText,
				name          : 'fiscalcal_id',
				store         : Ext.create('NP.store.property.FiscalCals', {
					service: 'PropertyService',
					action : 'getMasterClosingCalendars'
				}),
				selectFirstRecord: true,
				valueField       : 'fiscalcal_id',
				displayField     : 'fiscalcal_name'
    		},
    		{
				xtype         : 'combo',
				fieldLabel    : this.volumeTypeFieldText,
				queryMode     : 'local',
				forceSelection: true,
				name          : 'property_volume',
				store         : Ext.create('NP.store.property.VolumeTypes'),
				valueField    : 'code',
				displayField  : 'name'
    		}
    	];

    	this.callParent(arguments);
    }
});