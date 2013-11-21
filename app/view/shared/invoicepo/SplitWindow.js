/**
 * The line item split window
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.SplitWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.shared.invoicepo.splitwindow',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator',
        'NP.lib.ui.Grid',
        'NP.lib.ui.ComboBox',
    	'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save',
        'NP.store.system.DfSplits',
        'NP.view.shared.gridcol.UniversalField',
        'NP.view.shared.CustomField'
    ],

    layout     : {
        type : 'vbox',
        align: 'stretch'
    },
    width      : 800,
    height     : 600,
    border     : false,
    bodyPadding: 0,
    modal      : true,
    minimizable: false,
    autoScroll : true,

    // Additional options
    type: null,             // Needs to be set to 'invoice' or 'po'

    // For localization
    title: 'Line Item Allocation',
    
    initComponent: function() {
    	var me           = this,
            customFields = NP.Config.getCustomFields().line.fields;

        me.tbar = me.getButtonBar();

        me.items = [
            {
                xtype : 'container',
                layout: {
                    type : 'hbox',
                    align: 'bottom'
                },
                margin  : '0 8 4 8',
                defaults: { labelAlign:'top', margin: '0 8 0 0' },
                items: [
                    {
                        xtype           : 'numberfield',
                        fieldLabel      : NP.Translator.translate('Original Quantity'),
                        itemId          : 'splitTotalQty',
                        decimalPrecision: 6,
                        flex            : 1
                    },{
                        xtype     : 'textfield',
                        fieldLabel: NP.Translator.translate('Description'),
                        itemId     : 'splitDescription',
                        flex      : 3
                    },{
                        xtype           : 'numberfield',
                        fieldLabel      : NP.Translator.translate('Unit Price'),
                        itemId          : 'splitUnitPrice',
                        decimalPrecision: 6,
                        flex            : 1
                    },{
                        xtype : 'button',
                        text  : NP.Translator.translate('Recalculate'),
                        width : 65,
                        margin: 0
                    }
                ]
            },
            me.getGrid()
        ];

    	me.callParent(arguments);

        me.addEvents('changequantity','changeunitprice','changeamount','changepercentage');
    },

    getButtonBar: function() {
        return [
            { xtype: 'shared.button.cancel' },
            { xtype: 'shared.button.save' },
            { xtype: 'shared.button.save', text: NP.Translator.translate('Save and Create Default Split') },
            '-',
            'Select a Split',
            {
                xtype       : 'customcombo',
                name        : 'dfsplit_id',
                displayField: 'dfsplit_name',
                valueField  : 'dfsplit_id',
                store       : {
                    type   : 'system.dfsplits',
                    service: '',
                    action : ''
                }
            }
        ];
    },

    getGrid: function() {
        var me = this;

        me.propertyStore = Ext.create('NP.store.property.Properties', {
            service : 'PropertyService',
            action  : 'getByIntegrationPackage'
        });

        me.glStore = Ext.create('NP.store.gl.GlAccounts', {
            service : 'GLService',
            action  : (NP.Config.getSetting('CP.PROPERTYGLACCOUNT_USE') == '1') ? 'getByProperty' : 'getByIntegrationPackage'
        });

        var gridCfg = {
            xtype          : 'customgrid',
            itemId         : 'splitGrid',
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', { clicksToEdit: 1 })
            ],
            tbar           : [{
                xtype : 'shared.button.new',
                itemId: 'splitLineAddBtn',
                text  : NP.Translator.translate('Add Line')
            }],
            sortableColumns: false,
            flex           : 1,
            columns: [
                {
                    xtype   : 'actioncolumn',
                    width   : 25,
                    align   : 'center',
                    getClass: function(v, meta, rec, rowIndex) {
                        return 'delete-btn';
                    },
                    handler: function(view, rowIndex, colIndex, item, e, rec, row) {
                        me.getStore().removeAt(rowIndex);
                    }
                },
                // Percentage column
                {
                    xtype    : 'numbercolumn',
                    text     : NP.Translator.translate('Percentage'),
                    dataIndex: 'split_percentage',
                    format   : '0,000.0000',
                    width    : 100,
                    renderer : function(val, meta, rec) {
                        var totalQty = Ext.ComponentQuery.query('#splitTotalQty')[0].getValue(),
                            percent  = ((rec.get('invoiceitem_quantity') / totalQty) * 100).toFixed(4);

                        rec.set('split_percentage', percent);

                        return percent;
                    },
                    editor   : {
                        xtype           : 'numberfield',
                        decimalPrecision: 4,
                        listeners       : {
                            blur : function(field, e) {
                                me.fireEvent('changepercentage', me, field, e);
                            }
                        }
                    }
                },
                // Amount column
                {
                    xtype    : 'numbercolumn',
                    text     : NP.Translator.translate('Amount'),
                    dataIndex: 'invoiceitem_amount',
                    format   : '0,000.000000',
                    width    : 100,
                    editor   : {
                        xtype           : 'numberfield',
                        decimalPrecision: 6,
                        listeners       : {
                            blur: function(field, e) {
                                me.fireEvent('changeamount', me, field, e);
                            }
                        }
                    }
                },
                // Property column
                {
                    text     : NP.Config.getPropertyLabel(),
                    dataIndex: 'property_id',
                    width    : 200,
                    renderer : function(val, meta) {
                        if (val == null || val == '' || isNaN(val)) {
                            return '';
                        }
                        var rec = Ext.getStore('property.AllProperties').findRecord('property_id', val, 0, false, false, true);
                        
                        return rec.get('property_name');
                    },
                    editor: {
                        xtype       : 'customcombo',
                        itemId      : 'lineGridPropertyCombo',
                        displayField: 'property_name',
                        valueField  : 'property_id',
                        store       : me.propertyStore
                    }
                },
                // GL Account column
                {
                    text     : NP.Translator.translate('GL Account'),
                    dataIndex: 'glaccount_id',
                    width    : 250,
                    renderer : function(val, meta) {
                        if (val == null || val == '' || isNaN(val)) {
                            return '';
                        }
                        var rec = Ext.getStore('gl.AllGlAccounts').findRecord('glaccount_id', val, 0, false, false, true);
                        
                        return rec.get('display_name');
                    },
                    editor: {
                        xtype       : 'customcombo',
                        itemId      : 'lineGridGlCombo',
                        displayField: 'display_name',
                        valueField  : 'glaccount_id',
                        store       : me.glStore
                    }
                }
            ]
        };

        if (NP.Config.getSetting('PN.InvoiceOptions.AllowUnitAttach') == '1') {
            me.unitStore = Ext.create('NP.store.property.Units', {
                service    : 'PropertyService',
                action     : 'getUnits',
                extraParams: {
                    unit_status: 'active'
                }
            });

            gridCfg.columns.push({
                text     : NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit'),
                dataIndex: 'unit_id',
                width    : 200,
                renderer : function(val, meta) {
                    if (val == null || val == '' || isNaN(val)) {
                        return '';
                    }
                    var rec = Ext.getStore('property.AllUnits').findRecord('unit_id', val, 0, false, false, true);
                    
                    return rec.get('unit_number');
                },
                editor: {
                    xtype       : 'customcombo',
                    itemId      : 'lineGridUnitCombo',
                    displayField: 'unit_number',
                    valueField  : 'unit_id',
                    store       : me.unitStore,
                    hideLabel   : true
                }
            });
        }

        // Custom field columns
        for (var i=1; i<8; i++) {
            var customField = customFields[i];
            if (customField[typeShort+'On']) {
                gridCfg.columns.push({
                    xtype      : 'shared.gridcol.universalfield',
                    width      : 200,
                    type       : 'line',
                    fieldNumber: i,
                    editor     : {
                        xtype     : 'shared.customfield',
                        comboUi   : 'customcombo',
                        itemId    : 'invoiceLineCustomField' + i,
                        hideLabel : true,
                        entityType: 'customInvoicePO',
                        type      : customField.type,
                        isLineItem: 1,
                        number    : i,
                        allowBlank: !customField[typeShort + 'Required']
                    }
                });
            }
        }

        return gridCfg;
    }
});