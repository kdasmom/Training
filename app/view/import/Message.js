/**
 * Import/Export Utility show message
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.import.Message', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.import.message',
    requires: [
        'NP.view.shared.button.back',
    ],
    title: 'Message',
    bodyPadding: 8,
    html: 'The valid GL Codes were uploaded successfully.',

    initComponent: function() {
           var bar = [
                    { xtype: 'shared.button.back', text: 'Back' }
 	    		
	    ];
        this.tbar = bar;
    	this.callParent(arguments);
    }
});