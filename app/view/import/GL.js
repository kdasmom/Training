/**
 * Import/Export Utility > GL tab
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.import.GL', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.import.gl',
   
    requires: [
               'NP.lib.ui.VerticalTabPanel',
               'NP.view.import.GLCategory',
               'NP.view.import.GLCode',
               'NP.view.import.GLBudgets',
               'NP.view.import.GLActuals',
           	   'NP.view.shared.button.Cancel',
               'NP.view.shared.button.Upload'
           ],
           
    title: 'GL',

    layout: 'fit',
    
    bind: {
    	models: ['gl.GlAccount']
    },

    initComponent: function() {

        this.items = [{
            xtype : 'verticaltabpanel',
            border: false,
            defaults: {
                padding: 8
            },
            items : [
                { xtype: 'import.glcategory' },
                { xtype: 'import.glcode' },
                { xtype: 'import.glbudgets' },
                { xtype: 'import.glactuals' }, 
            ]
        }];
    	this.callParent(arguments);
    },
    isValid: function() {
        // Call the standard validation function
        var isValid = this.callParent();

        var field = this.findField('file_upload_category');
        if (field && field.getValue().length == 0) {
            field.markInvalid('This field is required.');
            isValid = false;
        }

        // Check for errors
        var errors = this.findInvalid();

        // If there are errors, make sure the first field is visible
        if (errors.getCount()) {
            errors.getAt(0).ensureVisible();
        }

        return isValid;
    }
});