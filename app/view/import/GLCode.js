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
    bodyPadding: 8,
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
                itemId: 'form_upload',
                xtype: 'form',
                autoScroll: true,
                border: false,
                bodyPadding: 8,
                items: [
                    {html: 'Please Note:', border: false},
                    {html: '<ul><li>This upload tool is for new GL Codes only. \n\
                                Any changes to the existing GL Codes should be made directly in GL Account Setup. </li></ul>',
                        border: false,
                        bodyPadding: '8 0 8 50',
                    },
                    {html: '<p>Select a valid CSV file to upload:</p>', border: false, margin: '10 0 0 0'},
                    {
                        xtype: 'filefield',
                        name: 'file_upload_category',
                        width: 400,
                        hideLabel: true,
                        allowBlank: false
                    }
                ]
            },
            {
                xtype: 'panel',
                hidden: true,
                border: false,
                items: [
                    {
                        html: 'If you exit from the Import/Export Utility without Accepting or Declining, \n\
                                    any import/export in process will be abandoned.',
                        border: false,
                        margin: '10 0 20 0'
                    },
                    {
                        xtype: Ext.create('NP.lib.ui.Grid', {
                            paging: true,
                            title: 'CSV GL Accounts Preview',
                            columns: [
                                {text: 'Status', dataIndex: 'exim_status'},
                                Ext.create('Ext.grid.RowNumberer'),
                                {text: 'GLAccount Name', dataIndex: 'exim_glaccountName', flex: 1},
                                {text: 'Account Number', dataIndex: 'exim_glaccountNumber', flex: 1},
                                {text: 'Account Type', dataIndex: 'exim_accountType', flex: 1},
                                {text: 'Category Name', dataIndex: 'exim_categoryName', flex: 1},
                                {text: 'Integration Package Name', dataIndex: 'exim_integrationPackage', flex: 1}
                            ],
                            store: []
                        })
                    }
                ]
            }
        ];
        this.callParent(arguments);
    }

});