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
				xtype     : 'textfield',
				name      : 'property_salestax',
				fieldLabel: NP.Config.getPropertyLabel() + ' ' + NP.Config.getSetting('PN.General.salesTaxTerm', 'Sales Tax'),
				width     : 350
    		},
    		{
				xtype     : 'textfield',
				name      : 'matching_threshold',
				fieldLabel: this.thresholdFieldText,
				width     : 350
    		},
    		{
				xtype         : 'combo',
				fieldLabel    : this.fiscalCalStartFieldText,
				width         : 450,
				name          : 'fiscaldisplaytype_value',
				store         : 'property.FiscalDisplayTypes',
				displayField  : 'fiscaldisplaytype_name',
				valueField    : 'fiscaldisplaytype_value',
				forceSelection: true
    		}
    	];

    	this.callParent(arguments);
    }
});