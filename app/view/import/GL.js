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
    }
});