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
        this.items = [
                  { xtype: 'filefield', name : 'file_upload_code', width: 400, hideLabel: true }
                      ];
    	this.callParent(arguments);
    },
    
});