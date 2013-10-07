/**
 * Import/Export Utility > GL tab > GL Code 
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.import.UploadForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.import.uploadform',
    
    requires: ['NP.view.shared.button.upload'],
    
    border: false,
    bodyPadding: 8,

    initComponent: function() {
        var bar = [
            {xtype: 'shared.button.upload'}
        ];

        this.tbar = bar;
        this.bbar = bar;

        this.items = [
            {html: 'Please Note:', border: false},
            {html: '<ul><li>This upload tool is for new ' + this.entityName + ' only. \n\
                        Any changes to the existing ' + this.entityName + ' should be made directly in ' + this.sectionName + '. </li></ul>',
                border: false,
                bodyPadding: '8 0 8 50',
            },
            {html: '<p>Select a valid CSV file to upload:</p>', border: false, margin: '10 0 0 0'},
            {
                itemId: 'form_upload',
                xtype: 'form',
                autoScroll: true,
                border: false,
                bodyPadding: 8,
                items: [
                    {
                        xtype: 'filefield',
                        name: this.fieldName,
                        width: 400,
                        hideLabel: true,
                        allowBlank: false
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }

});