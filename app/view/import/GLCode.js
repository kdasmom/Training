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
                        xtype: 'customgrid',
                        paging: true,
                        stateId : 'csv_grid',
                        title: 'CSV GL Accounts Preview',
                        columns: [
                            {text: 'Status', dataIndex: 'validation_status'},
                            Ext.create('Ext.grid.RowNumberer', {text: 'Row #', width: 43,}),
                            {text: 'GLAccount Name', dataIndex: 'glaccount_name', flex: 1},
                            {text: 'Account Number', dataIndex: 'glaccount_number', flex: 1},
                            {text: 'Account Type', dataIndex: 'account_type_name', flex: 1},
                            {text: 'Category Name', dataIndex: 'category_name', flex: 1},
                            {text: 'Integration Package Name', dataIndex: 'integration_package_name', flex: 1},
                            {text: 'Validation Messages', dataIndex: 'validation_messages', hide: true, flex :1}
                        ],
                        store: Ext.create('NP.store.gl.GlImportAccounts', {
                            service: 'GLService',
                            action: 'getCSVFile',
                            paging: true,
                            extraParams: {file: null}
                        })
                        
                    }
                ]
            }
        ];
        this.callParent(arguments);
    }

});