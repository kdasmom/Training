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
        'NP.view.shared.CustomField',
        'NP.store.invoice.InvoiceItems'
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
    closeable  : false,
    autoScroll : true,

    // Additional options
    type: null,             // Needs to be set to 'invoice' or 'po'

    initComponent: function() {
    	var me = this;;

        me.itemId = me.type + 'SplitWin';

        me.title = NP.Translator.translate('Line Item Split');

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
                        xtype     : 'textfield',
                        fieldLabel: NP.Translator.translate('Description'),
                        itemId    : 'splitDescription',
                        flex      : 3
                    },{
                        xtype           : 'numberfield',
                        fieldLabel      : NP.Translator.translate('Original Quantity'),
                        itemId          : 'splitTotalQty',
                        decimalPrecision: 6,
                        flex            : 1
                    },{
                        xtype           : 'numberfield',
                        fieldLabel      : NP.Translator.translate('Unit Price'),
                        itemId          : 'splitUnitPrice',
                        decimalPrecision: 6,
                        flex            : 1
                    },{
                        xtype : 'button',
                        itemId: 'recalculateBtn',
                        text  : NP.Translator.translate('Recalculate'),
                        width : 65,
                        margin: 0
                    }
                ]
            },
            me.getGrid()
        ];

        me.bbar = [
            '->',
            '<b>Left to Allocate:</b>',
            {
                xtype    : 'displayfield',
                hideLabel: true,
                itemId   : 'allocation_pct_left',
                renderer : function(val) {
                    if (val === '') {
                        val = 0;
                    }

                    return val + '%';
                }
            },
            {
                xtype    : 'displayfield',
                hideLabel: true,
                itemId   : 'allocation_amount_left',
                renderer : function(val) {
                    if (val === '') {
                        val = 0;
                    }

                    return Ext.util.Format.currency(val, NP.Config.getSetting('PN.Intl.currencySymbol', '$'));
                }
            }
        ];

    	me.callParent(arguments);

        me.grid = me.down('customgrid');

        me.grid.addEvents('changeamount','changepercentage');
    },

    getButtonBar: function() {
        var me = this;

        return [
            { xtype: 'shared.button.cancel', handler: function() { me.close(); } },
            { xtype: 'shared.button.save', itemId: 'saveSplitBtn' },
            {
                xtype : 'shared.button.save',
                itemId: 'saveDefaultSplitBtn',
                text  : NP.Translator.translate('Save and Create Default Split')
            },
            '->',
            '<b>' + NP.Translator.translate('Select a Split') + ':</b>',
            {
                xtype                : 'customcombo',
                itemId               : 'splitCombo',
                hideLabel            : true,
                name                 : 'dfsplit_id',
                displayField         : 'dfsplit_name',
                valueField           : 'dfsplit_id',
                width                : 250,
                store                : {
                    type   : 'system.dfsplits',
                    service: 'SplitService',
                    action : 'getByFilter'
                }
            }
        ];
    },

    getGrid: function() {
        var me            = this,
            customFields  = NP.Config.getCustomFields().line.fields,
            propertyStore = Ext.create('NP.store.property.Properties', {
                service : 'PropertyService',
                action  : 'getByIntegrationPackage'
            }),
            glStore = Ext.create('NP.store.gl.GlAccounts', {
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
            border         : false,
            sortableColumns: false,
            flex           : 1,
            store          : { type: 'invoice.invoiceitems' }, 
            columns: [
                {
                    xtype   : 'actioncolumn',
                    width   : 25,
                    align   : 'center',
                    getClass: function(v, meta, rec, rowIndex) {
                        return 'delete-btn';
                    },
                    handler: function(view, rowIndex, colIndex, item, e, rec, row) {
                        me.grid.getStore().removeAt(rowIndex);
                    }
                },
                // Percentage column
                {
                    xtype    : 'numbercolumn',
                    text     : NP.Translator.translate('Allocation %'),
                    dataIndex: 'split_percentage',
                    format   : '0,000.0000',
                    width    : 100,
                    editor   : {
                        xtype           : 'numberfield',
                        decimalPrecision: 4,
                        listeners       : {
                            blur : function(field, e) {
                                me.grid.fireEvent('changepercentage', me.grid, field, e);
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
                                me.grid.fireEvent('changeamount', me.grid, field, e);
                            }
                        }
                    }
                },
                // Balance column
                {
                    xtype    : 'numbercolumn',
                    text     : NP.Translator.translate('Balance'),
                    dataIndex: 'split_balance',
                    width    : 100,
                    renderer : function(val, meta, rec, rowIndex, colIndex, store) {
                        var unitPrice = me.down('#splitUnitPrice').getValue(),
                            qty       = me.down('#splitTotalQty').getValue(),
                            total     = qty * unitPrice;
                        
                        var balance = total;
                        for (var i=0; i<=rowIndex; i++) {
                            balance -= store.getAt(i).get('invoiceitem_amount');
                        }

                        return Ext.util.Format.number(balance, '0,000.000000');
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
                        xtype           : 'autocomplete',
                        itemId          : 'lineGridPropertyCombo',
                        displayField    : 'property_name',
                        valueField      : 'property_id',
                        allowBlank      : false,
                        validateOnBlur  : false,
                        validateOnChange: false,
                        selectOnFocus   : true,
                        store           : propertyStore
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
                        xtype           : 'autocomplete',
                        itemId          : 'lineGridGlCombo',
                        displayField    : 'display_name',
                        valueField      : 'glaccount_id',
                        allowBlank      : false,
                        validateOnBlur  : false,
                        validateOnChange: false,
                        selectOnFocus   : true,
                        store           : glStore
                    }
                }
            ]
        };

        if (NP.Config.getSetting('PN.InvoiceOptions.AllowUnitAttach') == '1') {
            var unitFieldReq = NP.Config.getSetting('PN.InvoiceOptions.unitFieldReq', '0'),
                unitStore    = Ext.create('NP.store.property.Units', {
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
                    
                    if (rec) {
                        return rec.get('unit_number');
                    } else {
                        return '';
                    }
                },
                editor: {
                    xtype           : 'autocomplete',
                    itemId          : 'lineGridUnitCombo',
                    displayField    : 'unit_number',
                    valueField      : 'unit_id',
                    allowBlank      : (unitFieldReq == 0) ? true : false,
                    validateOnBlur  : false,
                    validateOnChange: false,
                    selectOnFocus   : true,
                    triggerAction   : 'query',
                    store           : unitStore
                }
            });
        }

        // Custom field columns
        for (var i=1; i<8; i++) {
            var customField = customFields[i];
            if (customField['invOn']) {
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
                        allowBlank: !customField['invRequired'],
                        fieldCfg  : {
                            selectOnFocus   : true,
                            validateOnBlur  : false,
                            validateOnChange: false
                        }
                    }
                });
            }
        }

        gridCfg.propertyStore = propertyStore;
        gridCfg.glStore       = glStore;
        gridCfg.unitStore     = unitStore;

        return gridCfg;
    }
});