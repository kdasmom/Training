/**
 * A pie chart that shows vendors with most spending for the ytd
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.InvoiceStatistics', {
    extend: 'NP.view.shared.tile.AbstractTile',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.lib.core.Translator',
        'NP.lib.ui.Grid',
        'NP.lib.core.Util',
        'NP.lib.data.Store',
        'NP.view.shared.button.Print'
    ],

    /**
     * @return {Object|Ext.Component} A component to be diplayed in the My Settings > Dashboard section to preview the dashboard config; can be a fully initialized component or a definition object with an xtype.
     */
    getPreview: function() {
        var me = this;

        return me.getGrid(
            Ext.create('NP.lib.data.Store', {
                fields: me.getStoreFields(),
                data  : [
                    { name: '# of Images to Convert', total: 6, amount: 120.00 },
                    { name: '# of Open Invoices', total: 12, amount: 5891.5729 },
                    { name: '# of Invoices Pending Approval ', total: 55, amount: 54755.85 },
                    { name: '# of Completed Invoices to Approve', total: 26, amount: 8194.53 },
                    { name: '# of Invoices on Hold', total: 3, amount: 1430.00 },
                    { name: '# of Rejected Invoices', total: 18, amount: 6904.65 }
                ]
            })
        );
    },
    
    /**
     * @return {Object|Ext.Component} A component to display on the dashboard; can be a fully initialized component or a definition object with an xtype.
     */
    getDashboardPanel: function() {
        var me = this;

        return me.getGrid(
            Ext.create('NP.lib.data.Store', {
                fields     : me.getStoreFields(),
                service    : 'InvoiceService',
                action     : 'getInvoiceStatistics',
                extraParams: {
                    property_id: NP.Security.getCurrentContext().property_id
                },
                autoLoad   : true
            })
        );
    },

    getGrid: function(store) {
        return {
            xtype     : 'customgrid',
            tbar      : [
                {
                    xtype       : 'customcombo',
                    margin      : '0 8 0 8',
                    fieldLabel  : NP.Config.getPropertyLabel(),
                    labelWidth  : 50,
                    width       : 350,
                    name        : 'property_id',
                    displayField: 'property_name',
                    valueField  : 'property_id',
                    value       : NP.Security.getCurrentContext().property_id,
                    allowBlank  : false,
                    store       : 'user.Properties',
                    listeners   : {
                        select: function(combo, recs) {
                            var store = combo.up('customgrid').getStore();
                            store.addExtraParams({ property_id: recs[0].get('property_id') });
                            store.load();
                        }
                    }
                },
                '-',
                {
                    xtype  : 'shared.button.print',
                    handler: function() {
                        NP.PrintManager.print(this.up('customgrid'));
                    }
                }
            ],
            emptyText         : NP.Translator.translate('No statistics found for this property'),
            sortableColumns   : false,
            enableColumnHide  : false,
            enableColumnMove  : false,
            enableColumnResize: false,
            store             : store,
            columns           : [
                {
                    dataIndex: 'name',
                    text     : 'Stat',
                    flex     : 1
                },{
                    xtype    : 'numbercolumn',
                    format   : '0,000',
                    align    : 'right',
                    text     : 'Items',
                    dataIndex: 'total',
                    width    : 70
                },{
                    xtype    : 'numbercolumn',
                    text     : 'Amount',
                    dataIndex: 'amount',
                    align    : 'right',
                    width    : 90,
                    renderer : NP.Util.currencyRenderer
                }
            ]
        };
    },

    getStoreFields: function() {
        return [
            { name: 'name' },
            { name: 'total', type: 'int' },
            { name: 'amount', type: 'float' }
        ];
    }
});