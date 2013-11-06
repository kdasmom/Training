/**
 * Vertical tab in Property Setup > Properties > Add/Edit form 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.UnitForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.property.unitform',
    
    requires: [
    	'NP.lib.core.Config',
    	'NP.lib.core.Translator'
    ],

    bodyPadding: 8,
	margin     : '0 0 0 8',

	layout: 'form',

	initComponent: function() {
    	var that = this;

    	this.items = [
    		{
				xtype     : 'textfield',
				name      : 'unit_id_alt',
				fieldLabel: NP.Translator.translate('Code'),
				allowBlank: false
    		},
    		{
				xtype     : 'textfield', 
				name      : 'unit_number', 
				fieldLabel: NP.Translator.translate('Name'), 
				allowBlank: false
    		}
    	];

    	if (NP.Config.getSetting('VC_isOn') == '1') {
    		this.items.push({
				xtype       : 'customcombo',
				fieldLabel  : NP.Translator.translate('Type'),
				name        : 'unittype_id',
				displayField: 'unittype_name',
				valueField  : 'unittype_id',
				allowBlank  : false,
				store       : Ext.create('NP.store.property.UnitTypes', {
								service: 'PropertyService',
								action : 'getUnitTypesByProperty'
							})
    		});
    	}

    	this.buttons = [
			{ xtype: 'shared.button.save' },
			{ xtype: 'shared.button.cancel' }
		];
		this.buttonAlign = 'center';

    	this.callParent(arguments);
    }
});