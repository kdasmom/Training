/**
 * Import/Export Utility > GL tab > GL Code 
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.importing.UploadForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.importing.uploadform',
    
    requires: ['NP.view.shared.button.Upload'],
    
    border: false,
    bodyPadding: 8,

    layout: 'vbox',

    initComponent: function() {
        var instructions = '<b>Please Note:</b>';

        this.tbar = [
            {xtype: 'shared.button.upload'}
        ];

        if ('instructions' in this) {
            if (!Ext.isEmpty(this.instructions)) {
                instructions += ' ' + this.instructions;
            } else {
                instructions = null;
            }
        } else {
            instructions = instructions + ' This upload tool is for new ' + this.entityName + ' only. ' +
                        'Any changes to the existing ' + this.entityName + 
                        ' should be made directly in ' + this.sectionName + '.';
        }

        this.items = [];

        if (!Ext.isEmpty(instructions)) {
            this.items.push({
                xtype : 'component',
                html  : instructions,
                margin: '0 0 8 0'
            });
        }

        this.items.push(
            { xtype: 'component', html: '<p>Select a valid CSV file to upload:</p>' },
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
        );

        this.callParent(arguments);
    }

});