/**
 * Vertical tab in Property Setup > Properties > Add/Edit form 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.UnitTypeGrid', {
    extend: 'NP.lib.ui.Grid',
    alias: 'widget.property.unittypegrid',
    
    requires: [
    	'NP.lib.core.Config',
    	'NP.view.shared.button.New',
    	'NP.view.shared.button.View'
    ],

    stateful: true,
    stateId : 'property_unittype_grid',

    // For localization
	typeLabelText         : 'Type',
	unassignedUnitsBtnText: 'View ' + NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit') + 's Not Assigned to a ' + NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit') + ' Type',
	addBtnText            : 'Add ' + NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit') + ' Type',
	gridUniTypeColText    : NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit') + ' Type',
	gridBedroomsColText   : 'Bedrooms',
	gridBathroomsColText  : 'Bathrooms',
	gridLastUpdatedColText: 'Last Updated',

    initComponent: function() {
    	var that = this;

    	var unitTypeText = NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit') + ' Type';

    	this.store = Ext.create('NP.store.property.UnitTypes', {
						service    : 'PropertyService',
						action     : 'getUnitTypesByProperty',
						extraParams: {
							includeMeasurements: true,
							includeUnits       : true
						}
				    });

    	this.tbar = [
    		{ xtype: 'shared.button.new', text: this.addBtnText },
    		{ xtype: 'shared.button.view', text: this.unassignedUnitsBtnText  }
		];

		this.columns = [
    		{
				header   : this.gridUniTypeColText,
				dataIndex: 'unittype_name',
				flex     : 1
		    },{
				xtype    : 'numbercolumn',
				header   : this.gridBedroomsColText,
				dataIndex: 'unittype_bedrooms',
				flex     : 1
		    },{
				xtype    : 'numbercolumn',
				header   : this.gridBathroomsColText,
				dataIndex: 'unittype_bathrooms',
				flex     : 1
		    },{
				header   : this.gridLastUpdatedColText,
				dataIndex: 'unittype_updated_date',
				flex     : 1,
				renderer : function(val, meta, rec) {
					// If there's no date, don't display anything
					if (val === null) {
						return '';
					}

					var ret = Ext.Date.format(val, Ext.Date.defaultFormat);
					
					if (rec.get('unittype_updated_by') !== null) {
						ret += ' by ' + rec.getLastUpdatedUser().get('userprofile_username');
					}
					
					return ret;
				}
		    }
	    ];

    	this.callParent(arguments);
    }
});