/**
 * Vertical tab in Property Setup > Properties > Add/Edit form 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.PropertiesFormUnits', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.property.propertiesformunits',
    
    requires: [
    	'NP.lib.core.Config',
    	'NP.view.property.UnitGrid',
    	'NP.view.property.UnitForm'
    ],

    border: false,

    initComponent: function() {
    	var that = this;

    	this.title = NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit') + 's';

    	this.layout = {
			type: 'hbox',
			align: 'stretch'
		};

		this.items = [
			{ xtype: 'property.unitgrid', flex: 2 },
			{ xtype: 'property.unitform', flex: 1, hidden: true }
		];

    	this.callParent(arguments);
    }
});