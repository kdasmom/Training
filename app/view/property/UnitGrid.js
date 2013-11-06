/**
 * Vertical tab in Property Setup > Properties > Add/Edit form 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.UnitGrid', {
    extend: 'NP.lib.ui.Grid',
    alias: 'widget.property.unitgrid',
    
    requires: [
    	'NP.lib.core.Config',
    	'NP.lib.core.Translator',
    	'NP.view.shared.button.New',
    	'NP.view.shared.button.Delete'
    ],

    stateful: true,
    stateId : 'property_unit_grid',

    initComponent: function() {
    	var that = this;

    	var unitText = NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit');

    	this.selModel = Ext.create('Ext.selection.CheckboxModel', { checkOnly: true, mode: 'MULTI' });

    	this.store = Ext.create('NP.store.property.Units', {
						service    : 'PropertyService',
						action     : 'getUnits',
						extraParams: {
							unit_status: 'active'
						}
				    });

    	this.tbar = [
    		{
    			xtype: 'shared.button.new',
    			text: NP.Translator.translate('Add {unit}', { unit: unitText}),
    			itemId: 'addUnitBtn'
    		},
    		{
    			xtype: 'shared.button.delete',
    			text: NP.Translator.translate('Remove {unit}', { unit: unitText}),
    			disabled: true
    		}
		];

		this.columns = [
    		{
				header   : NP.Translator.translate('Code'),
				dataIndex: 'unit_id_alt',
				flex     : 1
		    },{
				header   : NP.Translator.translate('Name'),
				dataIndex: 'unit_number',
				flex     : 1
		    }
	    ];
	    
	    if (NP.Config.getSetting('VC_isOn') == '1') {
	    	this.columns.push({
	    		header   : 'Type',
				dataIndex: 'unittype_name',
				flex     : 1,
				renderer : function(val, meta, rec) {
					return rec.getUnitType().get('unittype_name')
				}
	    	});
	    }

    	this.callParent(arguments);
    }
});