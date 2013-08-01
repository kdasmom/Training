/**
 * Import/Export Utility > GL tab > GL Category 
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.import.GLCategory', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.import.glcategory',
            
    title: 'GL Category',
    bodyPadding: 8,
    html: '',

    initComponent: function() {
    	 this.items = [{
             xtype: 'form',
             autoScroll: true,
             border: false,
             bodyPadding: 8,
             items: [
	                     { 
	                    	 xtype: 'filefield', 
	                    	 name: 'file_upload_category', 
	                    	 width: 400, 
	                    	 hideLabel: true, 
	                    	 allowBlank: false
	                	 }
                     ]
    	 }];
    	this.callParent(arguments);
    }
});