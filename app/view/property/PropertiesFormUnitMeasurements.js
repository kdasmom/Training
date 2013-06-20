/**
 * Vertical tab in Property Setup > Properties > Add/Edit form 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.PropertiesFormUnitMeasurements', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.property.propertiesformunitmeasurements',
    
    requires: [
    	'NP.lib.core.Config',
    	'NP.view.property.UnitTypeGrid',
    	'NP.view.property.UnitTypeForm'
    ],

    border: false,

    measurementTitleText: 'Measurements',

    initComponent: function() {
    	var that = this;

    	this.title = NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit') + ' ' + this.measurementTitleText;

    	this.layout = {
			type: 'hbox',
			align: 'stretch'
		};

		this.items = [
			{ xtype: 'property.unittypegrid', flex: 2 },
			{ xtype: 'property.unittypeform', flex: 1, hidden: true }
		];

    	this.callParent(arguments);
    }
});