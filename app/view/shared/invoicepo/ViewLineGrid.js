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
        'NP.lib.ui.AutoComplete',
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
    autoScroll     : true,
    sortableColumns: false,

    initComponent: function() {
    	var me = this
            customFields = NP.Config.getCustomFields().line.fields,
            typeShort = (me.type == 'invoice') ? 'inv' : 'po';

        me.plugins = [
            Ext.create('Ext.grid.plugin.CellEditing', { clicksToEdit: 1 })
        ];

        me.propertyStore = Ext.create('NP.store.property.Properties', {
            service : 'PropertyService',
            action  : 'getByIntegrationPackage'
        });

        me.glStore = Ext.create('NP.store.gl.GlAccounts', {
            service : 'GLService',
            action  : (NP.Config.getSetting('CP.PROPERTYGLACCOUNT_USE') == '1') ? 'getByProperty' : 'getByIntegrationPackage'
        });

        me.columns = [
            // Quantity column
            {
                xtype    : 'numbercolumn',
                text     : NP.Translator.translate('QTY'),
                dataIndex: 'invoiceitem_quantity',
                format   : '0,000.000000',
                width    : 100,
                editor   : {
                    xtype           : 'numberfield',
                    decimalPrecision: 6,
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
                dataIndex: 'invoiceitem_description',
                width    : 300,
                editor   : {
                    xtype: 'textfield'
                }
            },
            // Unit Price column
            {
                xtype    : 'numbercolumn',
                text     : NP.Translator.translate('Unit Price'),
                dataIndex: 'invoiceitem_unitprice',
                format   : '0,000.000000',
                width    : 100,
                editor   : {
                    xtype           : 'numberfield',
                    decimalPrecision: 6,
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
                    if (val == null || val == '') {
                        return '';
                    }
                    var rec = Ext.getStore('property.AllProperties').findRecord('property_id', val, 0, false, false, true);
                    
                    return rec.get('property_name');
                },
                editor: {
                    xtype     : 'shared.propertycombo',
                    itemId    : 'lineGridPropertyCombo',
                    store     : me.propertyStore,
                    hideLabel : true
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
    	];

        // Unit column
        if (NP.Config.getSetting('PN.InvoiceOptions.AllowUnitAttach') == '1') {
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

        // Tax column
        me.columns.push({
            text     : NP.Translator.translate('Tax?'),
            dataIndex: 'invoiceitem_taxflag',
            width    : 50,
            renderer : function(val) {
                if (val === 1) {
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
                displayField: 'name',
                valueField  : 'value'
            }
        });

        // Custom field columns
        for (var i=1; i<8; i++) {
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

        me.columns.push(
            // Item Number column
            {
                text     : NP.Translator.translate('Item Number'),
                dataIndex: 'vcitem_number',
                width    : 150,
                editor   : {
                    xtype    : 'textfield',
                    maxLength: 100
                }
            },
            // UOM column
            {
                text     : NP.Translator.translate('UOM'),
                dataIndex: 'vcitem_uom',
                width    : 100,
                editor   : {
                    xtype    : 'textfield',
                    maxLength: 50
                }
            }
        );

        // Job costing columns (if JC is turned on)
        if (NP.Config.getSetting('pn.jobcosting.jobcostingEnabled', '0') == '1') {
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
                        xtype       : 'customcombo',
                        displayField: 'display_name',
                        valueField  : 'jbcontract_id',
                        store       : {
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
            me.columns.push({
                text     : NP.Config.getSetting('PN.jobcosting.changeOrderTerm'),
                dataIndex: 'jbchangeorder_id',
                width    : 300,
                renderer : function(val, meta, rec) {
                    return NP.model.jobcosting.JbChangeOrder.formatName(rec);
                },
                editor: {
                    xtype       : 'customcombo',
                    displayField: 'display_name',
                    valueField  : 'jbchangeorder_id',
                    store       : {
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
            
            // Job Code column
            me.columns.push({
                text: NP.Config.getSetting('PN.jobcosting.jobCodeTerm'),
                dataIndex: 'jbjobcode_id',
                width    : 300,
                renderer : function(val, meta, rec) {
                    return NP.model.jobcosting.JbJobCode.formatName(rec); 
                },
                editor: {
                    xtype       : 'customcombo',
                    displayField: 'display_name',
                    valueField  : 'jbjobcode_id',
                    store       : {
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

            // Phase Code column
            me.columns.push({
                text: NP.Config.getSetting('PN.jobcosting.phaseCodeTerm'),
                dataIndex: 'jbphasecode_id',
                width    : 300,
                renderer : function(val, meta, rec) {
                    return NP.model.jobcosting.JbPhaseCode.formatName(rec);
                },
                editor: {
                    xtype       : 'customcombo',
                    displayField: 'display_name',
                    valueField  : 'jbphasecode_id',
                    store       : {
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
                        xtype       : 'customcombo',
                        displayField: 'display_name',
                        valueField  : 'jbcostcode_id',
                        store       : {
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
        }
        
        me.utilityAccountStore = Ext.create('NP.store.vendor.UtilityAccounts', {
            service: 'UtilityService',
            action : 'getAccountsByVendorsite'
        });
        
        me.usageTypeStore = Ext.create('NP.store.vendor.UtilityColumnUsageTypes', {
            service: 'UtilityService',
            action : 'getUsageTypesByUtilityType'
        });

        // Utility Account column
        me.columns.push(
            {
                text     : 'Utility Account',
                dataIndex: 'utilityaccount_id',
                width    : 300,
                renderer : function(val, meta, rec) {
                    return NP.model.vendor.UtilityAccount.formatName(rec);
                },
                editor: {
                    xtype       : 'customcombo',
                    displayField: 'display_name',
                    valueField  : 'UtilityAccount_Id',
                    store       : me.utilityAccountStore,
                    listeners: {
                        select: function(combo, recs) {
                            me.fireEvent('selectutilityaccount', me, combo, recs);
                        }
                    }
                }
            },{
                text     : 'Usage Type',
                dataIndex: 'utilitycolumn_usagetype_id',
                width    : 200,
                renderer : function(val, meta, rec) {
                    return rec.get('UtilityColumn_UsageType_Name');
                },
                editor: {
                    xtype       : 'customcombo',
                    displayField: 'UtilityColumn_UsageType_Name',
                    valueField  : 'UtilityColumn_UsageType_Id',
                    store       : me.usageTypeStore,
                    listeners: {
                        select: function(combo, recs) {
                            me.fireEvent('selectusagetype', me, combo, recs);
                        }
                    }
                }
            }
        );

    	me.callParent(arguments);

        me.addEvents('selectjcfield','selectutilityaccount','selectusagetype',
                    'changequantity','changeunitprice','changeamount');
    }
});