/**
 * Vertical tab in Property Setup > Properties > Add/Edit form 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.PropertiesFormGl', {
    extend: 'NP.view.shared.GlAccountAssigner',
    alias: 'widget.property.propertiesformgl',
    
    requires: [
    	'NP.model.gl.GlAccount',
        'NP.lib.core.Translator'
       ],

	hideLabel    : true,
	name         : 'property_gls',
	displayField : 'glaccount_id',
	valueField   : 'glaccount_id',
	msgTarget    : 'under',
	buttons      : ['add','remove'],

	margin: 8,

    initComponent: function() {
		this.title     = NP.Translator.translate('GL Assignments');
    	
    	this.store = Ext.create('NP.store.gl.GlAccounts', {
			service: 'GLService',
			action : 'getByIntegrationPackage'
		});

    	this.callParent(arguments);
    }
});