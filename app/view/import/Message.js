/**
 * Import/Export Utility show message
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.import.Message', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.import.message',
            
    title: 'Message',
    bodyPadding: 8,
    html: 'The valid GL Codes were uploaded successfully.',

    initComponent: function() {
    	this.callParent(arguments);
    }
});