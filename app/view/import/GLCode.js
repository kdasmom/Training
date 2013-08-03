/**
 * Import/Export Utility > GL tab > GL Code 
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.import.GLCode', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.import.glcode',
            
    title: 'GL Code',
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