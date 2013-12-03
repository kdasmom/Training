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
    	'NP.lib.core.Translator',
    	'NP.view.shared.button.New',
    	'NP.view.shared.button.View'
    ],

    stateful: true,
    stateId : 'property_unittype_grid',

    initComponent: function() {
    	var that = this;

    	that.translateText();

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
    },

    translateText: function() {
    	var me = this,
            unitText = NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit');

    	me.typeLabelText          = NP.Translator.translate('Type');
		me.unassignedUnitsBtnText = NP.Translator.translate('View {unit}s Not Assigned to a {unit} Type', { unit: unitText});
		me.addBtnText             = NP.Translator.translate('Add {unit} Type', { unit: unitText});
		me.gridUniTypeColText     = NP.Translator.translate('{unit} Type', { unit: unitText});
		me.gridBedroomsColText    = NP.Translator.translate('Bedrooms');
		me.gridBathroomsColText   = NP.Translator.translate('Bathrooms');
		me.gridLastUpdatedColText = NP.Translator.translate('Last Updated');
    }
});