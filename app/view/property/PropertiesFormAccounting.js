/**
 * Vertical tab in Property Setup > Properties > Add/Edit form 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.PropertiesFormAccounting', {
    extend: 'Ext.container.Container',
    alias: 'widget.property.propertiesformaccounting',
    
    requires: [
    	'NP.lib.core.Config'
    ],

    autoScroll: true,
    
    title: 'Accounting Info',
    thresholdFieldText: 'Acceptable PO Matching Threshold (%)',
    fiscalCalStartFieldText: 'Fiscal Calendar Start Month',

    initComponent: function() {
    	this.defaults = {
    		labelWidth: 245
    	};
    	this.items = [
    		{
                xtype           : 'numberfield',
                name            : 'property_salestax',
                decimalPrecision: 6,
                fieldLabel      : NP.Config.getPropertyLabel() + ' ' + NP.Config.getSetting('PN.General.salesTaxTerm', 'Sales Tax'),
                width           : 350,
                minValue        : 0,
                maxValue        : 1,
                step            : 0.01
    		},
    		{
				xtype     : 'numberfield',
				name      : 'matching_threshold',
				fieldLabel: this.thresholdFieldText,
				width     : 350,
                minValue  : 0,
                maxValue  : 100
    		},
    		{
				xtype         : 'customcombo',
				fieldLabel    : this.fiscalCalStartFieldText,
				width         : 450,
				name          : 'fiscaldisplaytype_value',
				store         : 'property.FiscalDisplayTypes',
				displayField  : 'fiscaldisplaytype_name',
				valueField    : 'fiscaldisplaytype_value'
    		}
    	];

    	this.callParent(arguments);
    }
});