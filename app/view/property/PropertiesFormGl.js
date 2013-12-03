/**
 * Vertical tab in Property Setup > Properties > Add/Edit form 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.PropertiesFormGl', {
    extend: 'Ext.ux.form.ItemSelector',
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
		this.fromTitle = NP.Translator.translate('Unassigned');
		this.toTitle   = NP.Translator.translate('Assigned');

    	this.tpl = '<tpl for="."><div class="x-boundlist-item">{[NP.model.gl.GlAccount.formatName(values.glaccount_number, values.glaccount_name)]}</div></tpl>';
    	
    	this.store = Ext.create('NP.store.gl.GlAccounts', {
			service: 'GLService',
			action : 'getByIntegrationPackage'
		});

    	this.callParent(arguments);
    }
});