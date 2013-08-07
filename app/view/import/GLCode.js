/**
 * Import/Export Utility > GL tab > GL Code 
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.import.GLCode', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.import.glcode',
    requires: ['NP.lib.ui.Grid'],
    title: 'GL Code',
    border: false,
    initComponent: function() {
        var bar = [
            {xtype: 'shared.button.cancel'},
            {xtype: 'shared.button.upload'},
            {xtype: 'shared.button.inactivate', text: 'Decline', hidden: true},
            {xtype: 'shared.button.activate', text: 'Accept', hidden: true},
        ];

        this.tbar = bar;
        this.bbar = bar;

        this.items = [
            {
                xtype: 'panel',
                border: false,
                items: [
                    {html: 'Please Note:', border: false},
                    {html: '<ul><li>This upload tool is for new GL Codes only. \n\
                                Any changes to the existing GL Codes should be made directly in GL Account Setup. </li></ul>',
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
                                name: 'file_upload_category',
                                width: 400,
                                hideLabel: true,
                                allowBlank: false
                            }
                        ]
                    }
                ]
            },
        ];
        this.callParent(arguments);
    }

});