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
        var me               = this,
            customFields     = NP.Config.getCustomFields().line.fields,
            typeShort        = (me.type == 'invoice') ? 'inv' : 'po',
            invoice          = null,
            invoiceStatus    = null;

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
            },{
                xtype : 'shared.button.cancel',
                itemId: me.type + 'LineCancelBtn',
                text  : NP.Translator.translate('Undo Changes')
            }
        ];

        // We need the invoice status to determine if the row is deletable or not, but we
        // can't get it until the data has loaded
        if (me.type == 'invoice') {
            me.on('render', function() {
                invoice = me.up('[xtype="'+me.type+'.view"]')
                invoice.on('dataloaded', function(form, data) {
                    invoiceStatus = data['invoice_status'];

                    if (invoiceStatus == 'paid') {
                        me.down('#' + me.type + 'LineAddBtn').disable();
                    }

                    if (data['is_utility_vendor']) {
                        me.configureGrid();
                    }
                });
            });
        }

        // Set the CellEditing plugin on the grid
        me.plugins = [
            Ext.create('Ext.grid.plugin.CellEditing', { pluginId: 'cellediting', clicksToEdit: 1 })
        ];

        me.propertyStore = Ext.create('NP.store.property.Properties', {
            service : 'PropertyService',
            action  : 'getByIntegrationPackage'
        });

        me.glStore = Ext.create('NP.store.gl.GlAccounts', {
            service : 'GLService',
            action  : (NP.Config.getSetting('CP.PROPERTYGLACCOUNT_USE') == '1') ? 'getByProperty' : 'getByIntegrationPackage'
        });

        function onTriggerClick() {
            var combo = this,
                args  = arguments,
                store = combo.getStore();

            if (combo.isExpanded) {
                combo.collapse();
                combo.inputEl.focus();
            } else {
                function expandCombo() {
                    combo.onFocus({});
                    combo.doQuery(combo.allQuery, true);
                    combo.inputEl.focus();
                }
                
                if (combo.getStore().extraParamsHaveChanged()) {
                    combo.getStore().load(function() {
                        expandCombo();
                    });
                } else {
                    expandCombo();
                }
            }
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
                    if (me.type == 'invoice' && invoiceStatus == 'paid') {
                        return '';
                    } else {
                        return 'delete-btn';
                    }
                },
                handler: function(view, rowIndex, colIndex, item, e, rec, row) {
                    if (me.type == 'invoice' && invoiceStatus != 'paid') {
                        me.getStore().removeAt(rowIndex);
                    }
                }
            },
            // Quantity column
            {
                xtype    : 'numbercolumn',
                text     : NP.Translator.translate('QTY'),
                dataIndex: me.itemPrefix + '_quantity',
                hideable : false,
                format   : '0,000.00',
                //format : '0,000.000000',    // Temporarily changing to 2 decimals for user conference
                width    : 100,
                editor   : {
                    xtype           : 'numberfield',
                    decimalPrecision: 2,
                    //decimalPrecision: 6,    // Temporarily changing to 2 decimals for user conference
                    selectOnFocus   : true,
                    allowBlank      : false,
                    validateOnBlur  : false,
                    validateOnChange: false,
                    listeners       : {
                        blur: function(field, e) {
                            me.fireEvent('changequantity', me, field, e);
                        }
                    }
                }
            },
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
            {
                xtype    : 'numbercolumn',
                text     : NP.Translator.translate('Unit Price'),
                dataIndex: me.itemPrefix + '_unitprice',
                hideable : false,
                format   : '0,000.00',
                //format : '0,000.000000',    // Temporarily changing to 2 decimals for user conference
                width    : 100,
                editor   : {
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
                }
            },
            // Amount column
            {
                xtype    : 'numbercolumn',
                text     : NP.Translator.translate('Amount'),
                dataIndex: me.itemPrefix + '_amount',
                hideable : false,
                format   : '0,000.00',
                //format : '0,000.000000',    // Temporarily changing to 2 decimals for user conference
                width    : 100,
                editor   : {
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
                }
            },
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
                    useSmartStore   : true
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
                    useSmartStore   : true
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
                    useSmartStore   : true
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
                            type: 'jobcosting.jbcontracts',
                            service: 'JobCostingService',
                            action : 'getContracts'
                        },
                        listeners: {
                            select: function(combo, recs) {
                                me.fireEvent('selectjcfield', 'jbcontract', me, combo, recs);
                            }
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
                        listeners: {
                            select: function(combo, recs) {
                                me.fireEvent('selectjcfield', 'jbchangeorder', me, combo, recs);
                            }
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
                            action : 'getJobCodes'
                        },
                        listeners: {
                            select: function(combo, recs) {
                                me.fireEvent('selectjcfield', 'jbjobcode', me, combo, recs);
                            }
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
                        listeners: {
                            select: function(combo, recs) {
                                me.fireEvent('selectjcfield', 'jbphasecode', me, combo, recs);
                            }
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
                        listeners: {
                            select: function(combo, recs) {
                                me.fireEvent('selectjcfield', 'jbcostcode', me, combo, recs);
                            }
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

        me.addEvents('selectjcfield','selectutilityaccount','selectusagetype',
                    'changequantity','changeunitprice','changeamount','tablastfield');
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
        var me              = this,
            data            = me.up('[xtype="invoice.view"]').getLoadedData(),
            newCols         = me.baseCols.slice();

        // This is used to dynamically show or hide the Utility Account columns
        if (data['is_utility_vendor']) {
            if (!me.utilityAccountStore) {
                me.utilityAccountStore = Ext.create('NP.store.vendor.UtilityAccounts', {
                    service: 'UtilityService',
                    action : 'getAccountsByVendorsite'
                });
            
                me.usageTypeStore = Ext.create('NP.store.vendor.UtilityColumnUsageTypes', {
                    service: 'UtilityService',
                    action : 'getUsageTypesByUtilityType'
                });
            }

            // Utility Account columns
            newCols.push(
                {
                    text     : 'Utility Account',
                    itemId   : 'invoiceUtilityAccountCol',
                    dataIndex: 'utilityaccount_id',
                    width    : 300,
                    renderer : function(val, meta, rec) {
                        return NP.model.vendor.UtilityAccount.formatName(rec);
                    },
                    editor: {
                        xtype        : 'customcombo',
                        displayField : 'display_name',
                        valueField   : 'UtilityAccount_Id',
                        selectOnFocus: true,
                        store        : me.utilityAccountStore,
                        listeners    : {
                            select: function(combo, recs) {
                                me.fireEvent('selectutilityaccount', me, combo, recs);
                            }
                        }
                    }
                },{
                    text     : 'Usage Type',
                    itemId   : 'invoiceUsageTypeCol',
                    dataIndex: 'utilitycolumn_usagetype_id',
                    width    : 200,
                    renderer : function(val, meta, rec) {
                        return rec.get('UtilityColumn_UsageType_Name');
                    },
                    editor: {
                        xtype        : 'customcombo',
                        displayField : 'UtilityColumn_UsageType_Name',
                        valueField   : 'UtilityColumn_UsageType_Id',
                        selectOnFocus: true,
                        store        : me.usageTypeStore,
                        listeners    : {
                            select: function(combo, recs) {
                                me.fireEvent('selectusagetype', me, combo, recs);
                            }
                        }
                    }
                }
            );
        }

        me.reconfigure(null, newCols);
    }
});