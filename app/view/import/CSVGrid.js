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
                    {text: 'GLAccount Name', dataIndex: 'glaccount_name', flex: 1},
                    {text: 'Account Number', dataIndex: 'glaccount_number', flex: 1},
                    {text: 'Account Type', dataIndex: 'account_type_name', flex: 1},
                    {text: 'Category Name', dataIndex: 'category_name', flex: 1},
                    {text: 'Integration Package Name', dataIndex: 'integration_package_name', flex: 1},
                    {text: 'Validation Messages', dataIndex: 'validation_messages', hide: true, flex: 1}
                ],
                store: Ext.create('NP.store.gl.GlImportAccounts', {
                    service: 'GLService',
                    action: 'getCSVFile',
                    paging: true,
                    extraParams: {file: this.file}
                })
            }
        ];
        this.callParent(arguments);
    }

});