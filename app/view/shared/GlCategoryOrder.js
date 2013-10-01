/**
 * Generic component to order category
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.shared.GlCategoryOrder', {
    extend: 'Ext.ux.form.MultiSelect',
    alias: 'widget.shared.glcategoryorder',
    
    fieldLabel: 'Category',

    name        : 'categories',
    store       : Ext.create('NP.store.gl.GlAccounts', {
					service           : 'GLService',
					action            : 'getCategories',
					autoLoad          : true
			    }),
    displayField: 'glaccount_number',
    valueField  : 'glaccount_number',
    buttons     : ['up','down'],
    msgTarget   : 'under'
});