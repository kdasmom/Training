/**
 * Vertical tab in Property Setup > Properties > Add/Edit form 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.UnitTypeForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.property.unittypeform',
    
    requires: [
    	'NP.lib.core.Config',
    	'NP.lib.ui.Assigner'
    ],

    bodyPadding: 8,
	margin     : '0 0 0 8',
	layout     : {
		type : 'vbox',
		align: 'stretch'
	},

	// For localization
	nameLabelText: 'Name',
	bedroomsLabelText: '# of Bedrooms',
	bathroomsLabelText: '# of Bathrooms',

    initComponent: function() {
    	var that = this;

    	this.defaults = {
    		labelWidth: 150
    	};

    	this.items = [
    		{
    			xtype: 'textfield',
				fieldLabel: this.nameLabelText,
				name      : 'unittype_name',
				allowBlank: false,
				anchor: '100%'
    		},
    		{
    			xtype: 'container',
    			layout: {
    				type   : 'table',
    				columns: 2,
    				tableAttrs: {
			            style: {
			                width: '100%'
			            }
			        }
    			},
    			defaults: {
	    			labelWidth: 150,
	    			width     : 220
	    		},
    			items: [
    				{
						xtype           : 'numberfield',
						fieldLabel      : this.bedroomsLabelText,
						name            : 'unittype_bedrooms',
						margin          : '0 8 0 0',
						allowBlank      : false,
						decimalPrecision: 1,
						minValue        : 0,
						maxValue        : 9999.9
		    		},
		    		{
						xtype           : 'numberfield',
						fieldLabel      : this.bathroomsLabelText,
						name            : 'unittype_bathrooms',
						allowBlank      : false,
						decimalPrecision: 1,
						minValue        : 0,
						maxValue        : 9999.9
		    		}
    			]
    		}
    	];

    	var recs = Ext.getStore('property.UnitTypeMeasurements').getRange();
		Ext.Array.each(recs, function(rec, idx) {
			var cellCfg = {
				xtype           : 'numberfield',
				fieldLabel      : rec.get('unittype_material_name') + ' Sq. ' + rec.get('unittype_meas_name'),
				name            : 'unittype_val_' + rec.get('unittype_meas_id') + '_' + rec.get('unittype_material_id'),
				decimalPrecision: 2,
				minValue        : 0,
				maxValue        : 999999.99,
				allowBlank		: false
			};
			if (idx % 2 == 0) {
				cellCfg['margin'] = '0 8 0 0';
			}

			that.items[1].items.push(cellCfg);
    	});

		this.items.push({
			xtype        : 'assigner',
			name         : 'units',
			fieldLabel   : NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit') + 's',
			fromTitle    : 'Unassigned',
			toTitle      : 'Assigned',
			displayField : 'unit_id',
			valueField   : 'unit_id',
			tpl          : '<tpl for="."><div class="x-boundlist-item">{unit_id_alt} - {unit_number}</div></tpl>',
			store        : Ext.create('NP.store.property.Units', {
								service: 'PropertyService',
								action : 'getUnitsWithoutType'
							}),
			msgTarget    : 'under',
			flex         : 1
		});

    	this.buttons = [
			{ xtype: 'shared.button.save' },
			{ xtype: 'shared.button.cancel' }
		];
		this.buttonAlign = 'center';

    	this.callParent(arguments);
    }
});