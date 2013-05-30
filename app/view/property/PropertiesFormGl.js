/**
 * Vertical tab in Property Setup > Properties > Add/Edit form 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.PropertiesFormGl', {
    extend: 'Ext.ux.form.ItemSelector',
    alias: 'widget.property.propertiesformgl',
    
	title        : 'GL Assignments',
	fromTitleText: 'Assigned',
	toTitleText  : 'Unassigned',
	
	hideLabel    : true,
	name         : 'property_gls',
	fromTitle    : 'Unassigned',
	toTitle      : 'Assigned',
	displayField : 'glaccount_name',
	valueField   : 'glaccount_id',
	msgTarget    : 'under',
	buttons      : ['add','remove'],
	store        : Ext.create('NP.store.gl.GlAccounts', {
						service: 'GLService',
						action : 'getByIntegrationPackage'
				}),

	margin: 8,

    initComponent: function() {
    	this.emptyText = this.propertyGlEmptyText;

    	this.callParent(arguments);
    }
});