/**
 * Vertical tab in Property Setup > Properties > Add/Edit form 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.PropertiesFormGl', {
    extend: 'Ext.ux.form.ItemSelector',
    alias: 'widget.property.propertiesformgl',
    
    requires: ['NP.lib.core.Config'],

	title        : 'GL Assignments',
	fromTitleText: 'Assigned',
	toTitleText  : 'Unassigned',
	
	hideLabel    : true,
	name         : 'property_gls',
	fromTitle    : 'Unassigned',
	toTitle      : 'Assigned',
	displayField : 'glaccount_id',
	valueField   : 'glaccount_id',
	msgTarget    : 'under',
	buttons      : ['add','remove'],

	margin: 8,

    initComponent: function() {
    	var glDisplay = NP.Config.getSetting('PN.Budget.GLDisplayOrder', 'number').toLowerCase();
    	if (glDisplay == 'number') {
    		this.tpl = '<tpl for="."><div class="x-boundlist-item">{glaccount_number} ({glaccount_name})</div></tpl>';
    	} else if (glDisplay == 'numberonly') {
    		this.tpl = '<tpl for="."><div class="x-boundlist-item">{glaccount_number}</div></tpl>';
    	} else if (glDisplay == 'name') {
    		this.tpl = '<tpl for="."><div class="x-boundlist-item">{glaccount_name} ({glaccount_number})</div></tpl>';
    	}

    	this.store = Ext.create('NP.store.gl.GlAccounts', {
			service: 'GLService',
			action : 'getByIntegrationPackage'
		});
		
    	this.emptyText = this.propertyGlEmptyText;

    	this.callParent(arguments);
    }
});