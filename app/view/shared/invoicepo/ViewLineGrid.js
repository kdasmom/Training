/**
 * The line items edit grid for the invoice or PO page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.ViewLineGrid', {
    extend: 'NP.lib.ui.Grid',
    alias: 'widget.shared.invoicepo.viewlinegrid',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator',
        'Ext.grid.plugin.CellEditing',
        'Ext.grid.plugin.DragDrop',
        'Ext.grid.column.Action',
        'NP.lib.ui.AutoComplete',
        'NP.view.shared.button.New',
        'NP.view.shared.button.Save',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.gridcol.UniversalField',
        'NP.view.shared.PropertyCombo',
        'NP.view.shared.CustomField',
        'NP.store.property.Properties',
        'NP.store.gl.GlAccounts',
        'NP.store.property.Units',
        'NP.store.jobcosting.JbContracts',
        'NP.model.jobcosting.JbContract',
        'NP.store.jobcosting.JbChangeOrders',
        'NP.model.jobcosting.JbChangeOrder',
        'NP.store.jobcosting.JbJobCodes',
        'NP.model.jobcosting.JbJobCode',
        'NP.store.jobcosting.JbPhaseCodes',
        'NP.model.jobcosting.JbPhaseCode',
        'NP.store.jobcosting.JbCostCodes',
        'NP.model.jobcosting.JbCostCode',
        'NP.store.vendor.UtilityAccounts',
        'NP.store.vendor.UtilityColumnUsageTypes'
    ],

    bodyPadding    : 0,
    height         : 200,
    autoScroll     : true,
    sortableColumns: false,

    stateful       : true,
    
    initComponent: function() {
        var me           = this,
            customFields = NP.Config.getCustomFields().line.fields,
            typeShort    = (me.type == 'invoice') ? 'inv' : 'po',
            orderSetting = (me.type == 'invoice') ? 'CP.INVOICE_ORDER_LINE_ITEM' : 'CP.PO_ORDER_LINE_ITEM',
            entityView   = null,
            entityStatus = null;

        me.itemPrefix = me.type + 'item';

        me.stateId =  me.type + '_line_grid';

        me.selModel = Ext.create('Ext.selection.RowModel', {
            onEditorTab: function(editingPlugin, e) {
                me.onEditorTab.bind(this)(editingPlugin, e, me);
            }
        });

        me.tbar = [
            {
                xtype : 'shared.button.new',
                itemId: me.type + 'LineAddBtn',
                text  : NP.Translator.translate('Add Line')
            },{
                xtype : 'shared.button.save',
                itemId: me.type + 'LineSaveBtn',
                text  : NP.Translator.translate('Done With Changes')
            }/*
            TODO: permanently remove this once confirmed this functionality is not needed
            ,{
                xtype : 'shared.button.cancel',
                itemId: me.type + 'LineCancelBtn',
                text  : NP.Translator.translate('Undo Changes')
            }*/
        ];

        // We need the invoice status to determine if the row is deletable or not, but we
        // can't get it until the data has loaded
        if (me.type == 'invoice') {
            me.on('render', function() {
                entityView = me.up('[xtype="'+me.type+'.view"]');
                entityView.on('dataloaded', function(form, data) {
                    entityStatus = data['invoice_status'];

                    if (entityStatus == 'paid') {
                        me.down('#' + me.type + 'LineAddBtn').disable();
                    }

                    var vendorRec = me.getVendorRecord();
                    if (vendorRec && vendorRec.get('is_utility_vendor')) {
                        me.configureGrid();
                    }
                });
            });
        }

        // Set the CellEditing plugin on the grid
        me.plugins = [
            Ext.create('Ext.grid.plugin.CellEditing', { pluginId: 'cellediting', clicksToEdit: 1 })
        ];

        if (NP.Config.getSetting(orderSetting, '0') == 1) {
            me.viewConfig = {
                plugins: {
                    ptype: 'gridviewdragdrop'
                },
                listeners: {
                    beforedrop: function() {
                        if (Ext.Array.contains(['saved','paid','submitted','sent','draft'], entityStatus)) {
                            Ext.MessageBox.alert(
                                NP.Translator.translate('Cannot Re-Order'),
                                NP.Translator.translate('Line items cannot be re-ordered in this status')
                            );
                            return false;
                        }
                    }
                }
            };
        }

        me.propertyStore = Ext.create('NP.store.property.Properties', {
            service : 'PropertyService',
            action  : 'getByIntegrationPackage'
        });

        me.glStore = Ext.create('NP.store.gl.GlAccounts', {
            service : 'GLService',
            action  : (NP.Config.getSetting('CP.PROPERTYGLACCOUNT_USE') == '1') ? 'getByProperty' : 'getByIntegrationPackage'
        });

        me.utilityAccountStore = Ext.create('NP.store.vendor.UtilityAccounts', {
            service: 'UtilityService',
            action : 'getAccountsByVendorsite'
        });
    
        me.usageTypeStore = Ext.create('NP.store.vendor.UtilityColumnUsageTypes', {
            service: 'UtilityService',
            action : 'getUsageTypesByUtilityType'
        });

        me.moneyRenderer = function(val, meta, rec) {
            var format = '0,000.00';
            if (rec.get('is_utility') === 1) {
                format = '0,000.000000';
            }

            return Ext.util.Format.number(val, format);
        };

        me.columns = [
            {
                xtype     : 'actioncolumn',
                dataIndex : me.itemPrefix + '_action',
                width     : 25,
                align     : 'center',
                hideable  : false,
                resizeable: false,
                draggable : false,
                getClass  : function(v, meta, rec, rowIndex) {
                    if (me.type == 'invoice' && entityStatus == 'paid') {
                        return '';
                    } else {
                        return 'delete-btn';
                    }
                },
                handler: function(view, rowIndex, colIndex, item, e, rec, row) {
                    if (me.type == 'invoice' && entityStatus != 'paid') {
                        me.getStore().removeAt(rowIndex);
                    }
                }
            },
            // Quantity column
            me.getQtyCol(),
            // Description column
            {
                text     : NP.Translator.translate('Description'),
                dataIndex: me.itemPrefix + '_description',
                hideable : false,
                width    : 300,
                editor   : {
                    xtype        : 'textfield',
                    selectOnFocus: true
                }
            },
            // Unit Price column
            me.getUnitPriceCol(),
            // Amount column
            me.getAmountCol(),
            // Property column
            {
                text     : NP.Config.getPropertyLabel(),
                dataIndex: 'property_id',
                hideable : false,
                width    : 300,
                renderer : function(val, meta) {
                    if (val == null || val == '' || isNaN(val)) {
                        return '';
                    }
                    var rec = Ext.getStore('property.AllProperties').findRecord('property_id', val, 0, false, false, true);
                    
                    return rec.get('property_name');
                },
                editor: {
                    xtype           : 'customcombo',
                    itemId          : 'lineGridPropertyCombo',
                    displayField    : 'property_name',
                    valueField      : 'property_id',
                    allowBlank      : false,
                    validateOnBlur  : false,
                    validateOnChange: false,
                    selectOnFocus   : true,
                    store           : me.propertyStore,
                    useSmartStore   : true,
                    updateLineFields: {
                        property_id  : 'property_id',
                        property_name: 'property_id_alt',
                        property_name: 'property_name'
                    },
                    listeners: {
                        select: me.onLineComboSelect.bind(me)
                    }
                }
            },
            // GL Account column
            {
                text     : NP.Translator.translate('GL Account'),
                dataIndex: 'glaccount_id',
                hideable : false,
                width    : 375,
                renderer : function(val, meta) {
                    if (val == null || val == '' || isNaN(val)) {
                        return '';
                    }
                    var rec = Ext.getStore('gl.AllGlAccounts').findRecord('glaccount_id', val, 0, false, false, true);
                    
                    return rec.get('display_name');
                },
                editor: {
                    xtype           : 'customcombo',
                    itemId          : 'lineGridGlCombo',
                    displayField    : 'display_name',
                    valueField      : 'glaccount_id',
                    allowBlank      : false,
                    validateOnBlur  : false,
                    validateOnChange: false,
                    selectOnFocus   : true,
                    store           : me.glStore,
                    useSmartStore   : true,
                    updateLineFields: {
                        glaccount_id    : 'glaccount_id',
                        glaccount_number: 'glaccount_number',
                        glaccount_name  : 'glaccount_name'
                    },
                    listeners: {
                        select: me.onLineComboSelect.bind(me)
                    }
                }
            }
        ];

        // Unit column
        if (NP.Config.getSetting('PN.InvoiceOptions.AllowUnitAttach') == '1') {
            var unitFieldReq = NP.Config.getSetting('PN.InvoiceOptions.unitFieldReq', '0');

            me.unitStore = Ext.create('NP.store.property.Units', {
                service    : 'PropertyService',
                action     : 'getUnits',
                extraParams: {
                    unit_status: 'active'
                }
            });

            me.columns.push({
                text     : NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit'),
                dataIndex: 'unit_id',
                width    : 200,
                renderer : function(val, meta) {
                    if (val == null || val == '' || isNaN(val)) {
                        return '';
                    }
                    var rec = Ext.getStore('property.AllUnits').findRecord('unit_id', val, 0, false, false, true);
                    
                    if (rec !== null) {
                        return rec.get('unit_number');
                    }

                    return '';
                },
                editor: {
                    xtype           : 'customcombo',
                    itemId          : 'lineGridUnitCombo',
                    displayField    : 'unit_number',
                    valueField      : 'unit_id',
                    allowBlank      : (unitFieldReq == 0) ? true : false,
                    validateOnBlur  : false,
                    validateOnChange: false,
                    selectOnFocus   : true,
                    triggerAction   : 'query',
                    store           : me.unitStore,
                    useSmartStore   : true,
                    updateLineFields: {
                        unit_id    : 'unit_id',
                        unit_id_alt: 'unit_id_alt',
                        unit_number: 'unit_number'
                    },
                    listeners: {
                        select: me.onLineComboSelect.bind(me)
                    }
                }
            });
        }

        // Tax column
        me.columns.push({
            text     : NP.Translator.translate('Tax?'),
            dataIndex: me.itemPrefix + '_taxflag',
            width    : 50,
            renderer : function(val) {
                if (val === 'Y') {
                    return 'Yes';
                } else {
                    return 'No';
                }
            },
            editor: {
                xtype : 'customcombo',
                store : {
                    type        : 'store',
                    fields      : [{ name: 'name' }, { name: 'value' }],
                    data        : [{ name: 'Yes', value: 'Y' }, { name: 'No', value: 'N' }]
                },
                displayField : 'name',
                valueField   : 'value',
                selectOnFocus: true
            }
        });

        // Custom field columns
        for (var i=1; i<=8; i++) {
            var customField = customFields[i];
            if (customField[typeShort+'On']) {
                me.columns.push({
                    xtype      : 'shared.gridcol.universalfield',
                    width      : 200,
                    type       : 'line',
                    fieldNumber: i,
                    editor     : {
                        xtype     : 'shared.customfield',
                        comboUi   : 'customcombo',
                        layout    : 'fit',                  // Override the layout, fit plays nicer with cellediting
                        itemId    : 'invoiceLineCustomField' + i,
                        hideLabel : true,
                        entityType: 'customInvoicePO',
                        type      : customField.type,
                        isLineItem: 1,
                        number    : i,
                        allowBlank: !customField[typeShort + 'Required'],
                        fieldCfg  : {
                            selectOnFocus   : true,
                            validateOnBlur  : false,
                            validateOnChange: false,
                            useSmartStore   : true
                        }
                    }
                });
            }
        }

        if (NP.Config.getSetting('VC_isOn', '0') == 1) {
            me.columns.push(
                // Item Number column
                {
                    text     : NP.Translator.translate('Item Number'),
                    dataIndex: 'vcitem_number',
                    width    : 150,
                    editor   : {
                        xtype        : 'textfield',
                        selectOnFocus: true,
                        maxLength    : 100
                    }
                },
                // UOM column
                {
                    text     : NP.Translator.translate('UOM'),
                    dataIndex: 'vcitem_uom',
                    width    : 100,
                    editor   : {
                        xtype        : 'textfield',
                        selectOnFocus: true,
                        maxLength    : 50
                    }
                }
            );
        }

        // Job costing columns (if JC is turned on)
        if (
            NP.Config.getSetting('pn.jobcosting.jobcostingEnabled', '0') == '1'
            && (
                (me.type == 'invoice' && NP.Security.hasPermission(2047))
                || (me.type == 'po' && NP.Security.hasPermission(2049))
            )
        ) {
            // Contract column
            if (NP.Config.getSetting('pn.jobcosting.useContracts', '0') == '1') {
                me.columns.push({
                    text     : NP.Config.getSetting('PN.jobcosting.contractTerm'),
                    dataIndex: 'jbcontract_id',
                    width    : 300,
                    renderer : function(val, meta, rec) {
                        return NP.model.jobcosting.JbContract.formatName(rec);
                    },
                    editor: {
                        xtype         : 'customcombo',
                        displayField  : 'display_name',
                        valueField    : 'jbcontract_id',
                        selectOnFocus : true,
                        useSmartStore : true,
                        store         : {
                            type       : 'jobcosting.jbcontracts',
                            service    : 'JobCostingService',
                            action     : 'getContracts',
                            extraParams: {
                                status: 'active'
                            }
                        },
                        updateLineFields: {
                            jbcontract_id  : 'jbcontract_id',
                            jbcontract_name: 'jbcontract_name',
                            jbcontract_desc: 'jbcontract_desc'
                        },
                        listeners: {
                            select: me.onLineComboSelect.bind(me)
                        }
                    }
                });
            }

            // Change Order column
            if (NP.Config.getSetting('JB_UseChangeOrders', '0') == '1') {
                me.columns.push({
                    text     : NP.Config.getSetting('PN.jobcosting.changeOrderTerm'),
                    dataIndex: 'jbchangeorder_id',
                    width    : 300,
                    renderer : function(val, meta, rec) {
                        return NP.model.jobcosting.JbChangeOrder.formatName(rec);
                    },
                    editor: {
                        xtype         : 'customcombo',
                        displayField  : 'display_name',
                        valueField    : 'jbchangeorder_id',
                        selectOnFocus : true,
                        useSmartStore : true,
                        store         : {
                            type   : 'jobcosting.jbchangeorders',
                            service: 'JobCostingService',
                            action : 'getChangeOrders'
                        },
                        updateLineFields: {
                            jbchangeorder_id  : 'jbchangeorder_id',
                            jbchangeorder_name: 'jbchangeorder_name',
                            jbchangeorder_desc: 'jbchangeorder_desc'
                        },
                        listeners: {
                            select: me.onLineComboSelect.bind(me)
                        }
                    }
                });
            }
            
            // Job Code column
            if (NP.Config.getSetting('pn.jobcosting.useJobCodes', '0') == '1') {
                me.columns.push({
                    text: NP.Config.getSetting('PN.jobcosting.jobCodeTerm'),
                    dataIndex: 'jbjobcode_id',
                    width    : 300,
                    renderer : function(val, meta, rec) {
                        return NP.model.jobcosting.JbJobCode.formatName(rec); 
                    },
                    editor: {
                        xtype         : 'customcombo',
                        displayField  : 'display_name',
                        valueField    : 'jbjobcode_id',
                        selectOnFocus : true,
                        useSmartStore : true,
                        store         : {
                            type   : 'jobcosting.jbjobcodes',
                            service: 'JobCostingService',
                            action : 'getJobCodesByFilter'
                        },
                        updateLineFields: {
                            jbjobcode_id  : 'jbjobcode_id',
                            jbjobcode_name: 'jbjobcode_name',
                            jbjobcode_desc: 'jbjobcode_desc'
                        },
                        listeners: {
                            select: me.onLineComboSelect.bind(me)
                        }
                    }
                });
            }

            // Phase Code column
            if (NP.Config.getSetting('JB_UsePhaseCodes', '0') == '1') {
                me.columns.push({
                    text: NP.Config.getSetting('PN.jobcosting.phaseCodeTerm'),
                    dataIndex: 'jbphasecode_id',
                    width    : 300,
                    renderer : function(val, meta, rec) {
                        return NP.model.jobcosting.JbPhaseCode.formatName(rec);
                    },
                    editor: {
                        xtype         : 'customcombo',
                        displayField  : 'display_name',
                        valueField    : 'jbphasecode_id',
                        selectOnFocus : true,
                        useSmartStore : true,
                        store         : {
                            type   : 'jobcosting.jbphasecodes',
                            service: 'JobCostingService',
                            action : 'getPhaseCodes'
                        },
                        updateLineFields: {
                            jbphasecode_id  : 'jbphasecode_id',
                            jbphasecode_name: 'jbphasecode_name',
                            jbphasecode_desc: 'jbphasecode_desc'
                        },
                        listeners: {
                            select: me.onLineComboSelect.bind(me)
                        }
                    }
                });
            }

            // Cost Code column
            if (NP.Config.getSetting('pn.jobcosting.useCostCodes', '0') == '1') {
                me.columns.push({
                    text     : NP.Config.getSetting('PN.jobcosting.costCodeTerm'),
                    dataIndex: 'jbcostcode_id',
                    width    : 300,
                    renderer : function(val, meta, rec) {
                        return NP.model.jobcosting.JbCostCode.formatName(rec);
                    },
                    editor: {
                        xtype         : 'customcombo',
                        displayField  : 'display_name',
                        valueField    : 'jbcostcode_id',
                        selectOnFocus : true,
                        useSmartStore : true,
                        store         : {
                            type   : 'jobcosting.jbcostcodes',
                            service: 'JobCostingService',
                            action : 'getCostCodes'
                        },
                        updateLineFields: {
                            jbcostcode_id  : 'jbcostcode_id',
                            jbcostcode_name: 'jbcostcode_name',
                            jbcostcode_desc: 'jbcostcode_desc'
                        },
                        listeners: {
                            select: me.onLineComboSelect.bind(me)
                        }
                    }
                });
            }

            if (NP.Config.getSetting('pn.jobcosting.useRetention', '0') == '1') {
                // Retention column
                me.columns.push({
                    xtype    : 'numbercolumn',
                    text     : NP.Translator.translate('Retention'),
                    dataIndex: 'jbassociation_retamt',
                    format   : '0,000.00',
                    width    : 75,
                    editor   : {
                        xtype           : 'numberfield',
                        selectOnFocus   : true,
                        decimalPrecision: 2
                    }
                });
            }
        }

        me.baseCols = me.columns;

        me.callParent(arguments);

        me.addEvents('selectutilityaccount','changequantity','changeunitprice',
                    'changeamount','tablastfield');
    },

    getQtyCol: function() {
        var me = this;

        me.qtyEditor = Ext.widget({
            xtype           : 'numberfield',
            decimalPrecision: 2,
            selectOnFocus   : true,
            allowBlank      : false,
            validateOnBlur  : false,
            validateOnChange: false,
            listeners       : {
                blur: function(field, e) {
                    me.fireEvent('changequantity', me, field, e);
                }
            }
        });

        return {
            xtype    : 'numbercolumn',
            text     : NP.Translator.translate('QTY'),
            dataIndex: me.itemPrefix + '_quantity',
            hideable : false,
            renderer : me.moneyRenderer,
            width    : 100,
            editor   : me.qtyEditor
        };
    },

    getUnitPriceCol: function() {
        var me = this;

        me.unitPriceEditor = Ext.widget({
            xtype           : 'numberfield',
            decimalPrecision: 2,
            //decimalPrecision: 6,    // Temporarily changing to 2 decimals for user conference
            selectOnFocus   : true,
            allowBlank      : false,
            validateOnBlur  : false,
            validateOnChange: false,
            listeners       : {
                blur: function(field, e) {
                    me.fireEvent('changeunitprice', me, field, e);
                }
            }
        });

        return {
            xtype    : 'numbercolumn',
            text     : NP.Translator.translate('Unit Price'),
            dataIndex: me.itemPrefix + '_unitprice',
            hideable : false,
            renderer : me.moneyRenderer,
            width    : 100,
            editor   : me.unitPriceEditor
        }
    },

    getAmountCol: function() {
        var me = this;

        me.amountEditor = Ext.widget({
            xtype           : 'numberfield',
            decimalPrecision: 2,
            //decimalPrecision: 6,    // Temporarily changing to 2 decimals for user conference
            selectOnFocus   : true,
            allowBlank      : false,
            validateOnBlur  : false,
            validateOnChange: false,
            listeners       : {
                blur: function(field, e) {
                    me.fireEvent('changeamount', me, field, e);
                }
            }
        });

        return {
            xtype    : 'numbercolumn',
            text     : NP.Translator.translate('Amount'),
            dataIndex: me.itemPrefix + '_amount',
            hideable : false,
            renderer : me.moneyRenderer,
            width    : 100,
            editor   : me.amountEditor
        }
    },

    onEditorTab: function(editingPlugin, e, grid) {
        var me           = this,
            view         = me.views[0],
            record       = editingPlugin.getActiveRecord(),
            header       = editingPlugin.getActiveColumn(),
            position     = view.getPosition(record, header),
            direction    = e.shiftKey ? 'left' : 'right',
            row          = position.row,
            column       = position.column,
            lastRow      = grid.getStore().getCount()-1,
            lastCol      = grid.columnManager.getColumns().length - 1;

        if (direction == 'right' && row == lastRow && column == lastCol) {
            grid.fireEvent('tablastfield');
        } else {
            // We want to continue looping while:
            // 1) We have a valid position
            // 2) There is no editor at that position
            // 3) There is an editor, but editing has been cancelled (veto event)

            do {
                position  = view.walkCells(position, direction, e, me.preventWrap);
            } while (position && (!position.columnHeader.getEditor(record) || !editingPlugin.startEditByPosition(position)));
        }
    },

    configureGrid: function() {
        var me        = this,
            vendorRec = me.getVendorRecord(),
            newCols   = me.baseCols.slice();

        // This is used to dynamically show or hide the Utility Account columns
        if (vendorRec && vendorRec.get('is_utility_vendor') === 1) {
            // Utility Account columns
            newCols.push(
                me.getUtilAccountCol(),
                me.getUsageTypeCol()
            );            
        }

        me.reconfigure(null, newCols);

        me.setupUtilityEditors();
    },

    getUtilAccountCol: function() {
        var me = this;

        if (!me.utilAccountEditor) {
            me.utilAccountEditor = Ext.widget({
                xtype        : 'customcombo',
                displayField : 'display_name',
                valueField   : 'UtilityAccount_Id',
                selectOnFocus: true,
                store        : me.utilityAccountStore,
                updateLineFields: {
                    UtilityAccount_Id           : 'utilityaccount_id',
                    UtilityAccount_AccountNumber: 'UtilityAccount_AccountNumber',
                    UtilityAccount_MeterSize    : 'UtilityAccount_MeterSize',
                    UtilityType_Id              : 'UtilityType_Id',
                    UtilityType                 : 'UtilityType'
                },
                listeners    : {
                    select: function(combo, recs) {
                        me.onLineComboSelect(combo, recs);
                        me.fireEvent('selectutilityaccount', me, combo, recs);
                    }
                }
            });
        }

        return {
            text     : 'Utility Account',
            itemId   : 'invoiceUtilityAccountCol',
            dataIndex: 'utilityaccount_id',
            width    : 300,
            renderer : function(val, meta, rec) {
                return NP.model.vendor.UtilityAccount.formatName(rec);
            },
            editor: me.utilAccountEditor
        };
    },

    getUsageTypeCol: function() {
        var me = this;

        if (!me.usageTypeEditor) {
            me.usageTypeEditor = Ext.widget({
                xtype        : 'customcombo',
                displayField : 'UtilityColumn_UsageType_Name',
                valueField   : 'UtilityColumn_UsageType_Id',
                selectOnFocus: true,
                store        : me.usageTypeStore,
                useSmartStore: true,
                updateLineFields: {
                    UtilityColumn_UsageType_Id  : 'utilitycolumn_usagetype_id',
                    UtilityColumn_UsageType_Name: 'UtilityColumn_UsageType_Name'
                },
                listeners    : {
                    select: me.onLineComboSelect.bind(me)
                }
            });
        }

        return {
            text     : 'Usage Type',
            itemId   : 'invoiceUsageTypeCol',
            dataIndex: 'utilitycolumn_usagetype_id',
            width    : 200,
            renderer : function(val, meta, rec) {
                return rec.get('UtilityColumn_UsageType_Name');
            },
            editor: me.usageTypeEditor
        };
    },

    setupUtilityEditors: function() {
        var me           = this,
            moneyEditors = ['qtyEditor','amountEditor','unitPriceEditor'],
            utilEditors  = ['utilAccountEditor','usageTypeEditor'],
            i;

        for (i=0; i<moneyEditors.length; i++) {
            me[moneyEditors[i]].decimalPrecision = (me.utilityAccountStore.getCount()) ? 6 : 2;
        }
        
        for (i=0; i<utilEditors.length; i++) {
            var readonly = (me.utilityAccountStore.getCount()) ? false : true;
            me[utilEditors[i]].setReadOnly(readonly);
        }
    },

    getVendorRecord: function() {
        var me          = this,
            vendorField = Ext.ComponentQuery.query('#entityVendorCombo')[0];

        if (vendorField.getValue() !== null) {
            return vendorField.findRecordByValue(vendorField.getValue());
        }

        return null;
    },

    onLineComboSelect: function(combo, recs) {
        var me      = this,
            newData = {},
            field,
            gridField,
            val;

        for (field in combo.updateLineFields) {
            gridField          = combo.updateLineFields[field];
            val                = (recs.length) ? recs[0].get(field) : null;
            newData[gridField] = val;
        }

        me.selectedRec.set(newData);
    }
});