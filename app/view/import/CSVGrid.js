/**
 * CSV grid
 *
 * @author Zubik Aliaksandr
 */
Ext.define('NP.view.import.CSVGrid', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.import.csvgrid',
    requires: [
        'NP.lib.core.Config',
        'NP.view.shared.button.Inactivate',
        'NP.view.shared.button.Activate',
        'NP.lib.ui.Grid',
    ],
    border: false,
    initComponent: function() {
        this.items = [
            {
                xtype: 'panel',
                border: false,
                items: [
                    {
                        html: 'If you exit from the Import/Export Utility without Accepting or Declining, \n\
                                    any import/export in process will be abandoned.',
                        border: false,
                        margin: '10 0 20 0'
                    }
                ]
            },{
                xtype: 'customgrid',
                paging: true,
                stateId: 'csv_grid',
                title: 'CSV GL Accounts Preview',
                columns: [
                    {text: 'Status', dataIndex: 'validation_status'},
                    Ext.create('Ext.grid.RowNumberer', {text: 'Row #', width: 43, }),
                    {text: 'GLAccount Name', dataIndex: 'GL Account Name', flex: 1},
                    {text: 'Account Number', dataIndex: 'AccountNumber', flex: 1},
                    {text: 'Account Type', dataIndex: 'AccountType', flex: 1},
                    {text: 'Category Name', dataIndex: 'CategoryName', flex: 1},
                    {text: 'Integration Package Name', dataIndex: 'IntegrationPackageName', flex: 1},
                    {text: 'Validation Messages', dataIndex: 'validation_messages', hide: true, flex: 1}
                ],
                store: Ext.create('NP.store.gl.GlImportAccounts', {
                    service: 'GLService',
                    action: 'getPreview',
                    paging: true,
                    extraParams: {file: this.file, type: 'GLA.json'}
                })
            }
        ];
        this.callParent(arguments);
    }

});