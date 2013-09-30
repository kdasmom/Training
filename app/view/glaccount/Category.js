/**
 * GL Account Setup > Category
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.glaccount.Category', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.glaccount.category',
    
    title: 'Category',

    initComponent: function() {
        var defaultWidth = 578;
         
        var glStore = Ext.create('NP.store.gl.GlAccounts', {
            service : 'GLService',
            action  : 'getCategories'
        });
        glStore.load();
        
        this.items = [            
            {
                xtype           : 'customcombo',
                emptyText       : this.allCategoriesEmptyText,
                width           : defaultWidth,
                name            : 'glaccount_level',
                displayField    : 'glaccount_name',
                valueField      : 'glaccount_id',
                store           : glStore,
                fieldLabel      : this.categoryFieldText
            },],
    	this.callParent(arguments);
    }
});