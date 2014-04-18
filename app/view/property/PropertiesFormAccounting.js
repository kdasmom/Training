/**
 * Vertical tab in Property Setup > Properties > Add/Edit form 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.PropertiesFormAccounting', {
    extend: 'Ext.container.Container',
    alias: 'widget.property.propertiesformaccounting',
    
    requires: [
    	'NP.lib.core.Config',
        'NP.lib.core.Translator'
    ],

    autoScroll: true,
    
    initComponent: function() {
        var propertyText = NP.Config.getPropertyLabel(),
            taxText      = NP.Config.getSetting('PN.General.salesTaxTerm', 'Sales Tax');

        this.title = NP.Translator.translate('Accounting Info');

    	this.defaults = {
    		labelWidth: 245
    	};
    	this.items = [
    		{
                xtype           : 'numberfield',
                name            : 'property_salestax',
                decimalPrecision: 0,
                fieldLabel      : NP.Translator.translate('{property} {salesTax}', { property: propertyText, salesTax: taxText }),
                width           : 350,
                minValue        : 0,
                maxValue        : 100,
                step            : 1,
				allowBlank		: false,
                afterBodyEl     : '%',
                allowDecimal    : false
    		},
    		{
				xtype     : 'numberfield',
				name      : 'matching_threshold',
				fieldLabel: NP.Translator.translate('Acceptable PO Matching Threshold (%)'),
				width     : 350,
                minValue  : 0,
                maxValue  : 100,
				allowBlank	: false
    		},
    		{
				xtype         : 'customcombo',
				fieldLabel    : NP.Translator.translate('Fiscal Calendar Start Month'),
				width         : 450,
				name          : 'fiscaldisplaytype_value',
				store         : 'property.FiscalDisplayTypes',
				displayField  : 'fiscaldisplaytype_name',
				valueField    : 'fiscaldisplaytype_id',
				allowBlank	  : false
    		}
    	];

    	this.callParent(arguments);
    }
});