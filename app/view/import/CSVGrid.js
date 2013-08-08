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
            }, {
                xtype: 'customgrid',
                paging: true,
                stateId: 'csv_grid',
                title: 'CSV GL Accounts Preview',
                columns: [
                    {text: 'Status', dataIndex: 'validation_status',
                        renderer: function(val, meta, rec) {
                            if (val == 'invalid'){
                                meta.tdAttr = 'data-qtip="Invalid"';
                                return '<img src="resources/images/buttons/inactivate.gif"/>';
                            } else {
                                meta.tdAttr = 'data-qtip="Valid"';
                                return '<img src="resources/images/buttons/activate.gif"/>';
                            }
                        
                        }
                    },
                    Ext.create('Ext.grid.RowNumberer', {text: 'Row #', width: 43, }),
                    {text: 'GLAccount Name', dataIndex: 'GL Account Name', flex: 1},
                    {text: 'Account Number', dataIndex: 'AccountNumber', flex: 1},
                    {text: 'Account Type', dataIndex: 'AccountType', flex: 1,
                        renderer: function(val, meta, rec) {
                            var value = val.split(';');
                            if (value[1]) {
                                meta.tdAttr = 'data-qtip="' + value[1] + '"';
                                return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
                            } else {
                                return val;
                            }

                        }
                    },
                    {text: 'Category Name', dataIndex: 'CategoryName', flex: 1,
                        renderer: function(val, meta, rec) {
                            var value = val.split(';');
                            if (value[1]) {
                                meta.tdAttr = 'data-qtip="' + value[1] + '"';
                                return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
                            } else {
                                return val;
                            }
                        }},
                    {text: 'Integration Package Name', dataIndex: 'IntegrationPackageName', flex: 1,
                        renderer: function(val, meta, rec) {
                            var value = val.split(';');
                            if (value[1]) {
                                meta.tdAttr = 'data-qtip="' + value[1] + '"';
                                return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
                            } else {
                                return val;
                            }
                        }
                    }
                ],
                store: Ext.create('NP.store.gl.GlImportAccounts', {
                    service: 'ImportService',
                    action: 'getPreview',
                    paging: true,
                    extraParams: {file: this.file, type: 'GLAccount.json'}
                })
            }
        ];
        this.callParent(arguments);
    }

});