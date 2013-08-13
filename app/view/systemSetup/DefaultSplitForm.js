/**
 * User Manager > Users tab > Form
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.systemSetup.DefaultSplitForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.systemsetup.defaultsplitform',

    requires: [
        'NP.lib.core.Config',
    	'NP.view.shared.button.Save',
        'NP.view.shared.button.New',
        'NP.view.shared.button.Delete',
        'NP.view.shared.button.Reset',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Allocate',
        'NP.lib.ui.Grid',
        'NP.lib.ui.ComboBox',
        'NP.view.shared.VendorAutoComplete',
        'NP.view.shared.PropertyCombo',
        'NP.view.shared.GlCombo',
        'NP.view.shared.UnitCombo',
        'NP.view.shared.CustomField',
        'NP.model.gl.GlAccount'
    ],

    layout: {
        type : 'vbox',
        align: 'stretch'
    },
    border          : false,
    trackResetOnLoad: true,

    // For localization
    copySplitBtnText   : 'Copy Split',
    splitNameLabel     : 'Split Name',
    intPkgFieldLabel   : 'Integration Package',
    allocationGridTitle: 'Allocation Details',
    glAccountColText   : 'GL Account',
    percentColText     : 'Percentage',
    propInactiveError  : NP.Config.getPropertyLabel() + ' is inactive',
    propOnHoldError    : NP.Config.getPropertyLabel() + ' is on hold',
    glInactiveError    : 'GL Account is inactive',
    addSplitBtnText    : 'Add Split',
    autoAllocBtnText   : 'Auto Allocate by ' + NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit'),
    leftToAllocateText : 'Left to allocate',
    allocationErrorText: 'Allocation must add up to 100%',
    propertyErrorText  : 'Please make sure each allocation line has a ' + NP.Config.getPropertyLabel() + ' selected',
    dialogErrorText    : 'Error',
    
    initComponent: function() {
    	var that = this;

    	var bar = [
    		{ xtype: 'shared.button.save', itemId: 'saveSplitFormBtn' },
            { xtype: 'shared.button.new', itemId: 'copySplitFormBtn', text: this.copySplitBtnText, hidden: true },
            { xtype: 'shared.button.delete', itemId: 'deleteSplitFormBtn', hidden: true },
            { xtype: 'shared.button.reset', itemId: 'resetSplitFormBtn' },
            { xtype: 'shared.button.cancel', itemId: 'cancelSplitFormBtn' }
	    ];
	    this.tbar = bar;
	    this.bbar = bar;

        var propStore = Ext.create('NP.store.property.Properties', {
                           service : 'PropertyService',
                           action  : 'getByIntegrationPackage'
                        });

        var glStore = Ext.create('NP.store.gl.GlAccounts', {
                           service : 'GLService',
                           action  : (NP.Config.getSetting('CP.PROPERTYGLACCOUNT_USE') == '1') ? 'getByProperty' : 'getByIntegrationPackage'
                        });

        this.items = [{
            xtype: 'container',
            margin: 8,
            defaults: {
                labelWidth: 150,
                width     : 600
            },
            items: [
                {
                    xtype     : 'textfield',
                    fieldLabel: this.splitNameLabel,
                    name      : 'dfsplit_name',
                    allowBlank: false
                },{
                    xtype            : 'customcombo',
                    fieldLabel       : this.intPkgFieldLabel,
                    name             : 'integration_package_id',
                    store            : 'system.IntegrationPackages',
                    displayField     : 'integration_package_name',
                    valueField       : 'integration_package_id',
                    allowBlank       : false,
                    selectFirstRecord: true
                },{
                    xtype       : 'shared.vendorautocomplete',
                    allowBlank  : true,
                    emptyText   : 'All',
                    disabled    : true,
                    store       : Ext.create('NP.store.vendor.Vendors', {
                                    service: 'VendorService',
                                    action: 'getByIntegrationPackage'
                                })
                },{
                    xtype    : 'displayfield',
                    hideLabel: true,
                    hidden   : true,
                    name     : 'allocationErrors',
                    margin   : '12 0 0 0',
                }
            ]
        }];

        var hideAutoAlloc = (NP.Config.getSetting('PN.InvoiceOptions.AllowUnitAttach') == '1') ? false : true;
        var gridConfig = {
            xtype: 'customgrid',
            title: this.allocationGridTitle,
            flex : 1,
            border: '1 0 0 0',
            tbar: [
                { xtype: 'shared.button.new', itemId: 'addSplitAllocBtn', text: this.addSplitBtnText, disabled: true },
                { xtype: 'shared.button.allocate', itemId: 'autoAllocBtn', text: this.autoAllocBtnText, hidden: hideAutoAlloc }
            ],
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', { clicksToEdit: 1 })
            ],
            features: [{
                ftype: 'summary'
            }],
            store  : Ext.create('NP.store.system.DfSplitItems', {
                        service   : 'SplitService',
                        action    : 'getSplitItems',
                        sortOnLoad: true,
                        sorters   : [{
                            sorterFn: function(rec1, rec2){
                                var propName1 = '';
                                if (rec1.get('property_id') !== null) {
                                    propName1 = Ext.getStore('property.AllProperties')
                                                    .findRecord('property_id', rec1.get('property_id'), 0, false, false, true)
                                                    .get('property_name');
                                }
                                var propName2 = '';
                                if (rec2.get('property_id') !== null) {
                                    propName2 = Ext.getStore('property.AllProperties')
                                                    .findRecord('property_id', rec2.get('property_id'), 0, false, false, true)
                                                    .get('property_name');
                                }

                                if (propName1 == propName2) {
                                    var glName1 = '';
                                    var glName2 = '';
                                    var sortField = 'glaccount_number';
                                    if (NP.Config.getSetting('PN.Budget.GLDisplayOrder', 'number').toLowerCase() == 'name') {
                                        sortField = 'glaccount_name';
                                    }

                                    if (rec1.get('glaccount_id') != null) {
                                        glName1 = Ext.getStore('gl.AllGlAccounts')
                                                    .findRecord('glaccount_id', rec1.get('glaccount_id'), 0, false, false, true)
                                                    .get(sortField);
                                    }
                                    if (rec2.get('glaccount_id') != null) {
                                        glName2 = Ext.getStore('gl.AllGlAccounts')
                                                    .findRecord('glaccount_id', rec2.get('glaccount_id'), 0, false, false, true)
                                                    .get(sortField);
                                    }
                                    
                                    
                                    return (glName1 < glName2) ? -1 : 1;
                                } else {
                                    return (propName1 < propName2) ? -1 : 1;
                                }
                            }
                        }],
                        listeners: {
                            update: function(store, rec, operation, modifiedFieldNames, eOpts) {
                                that.query('customgrid')[0].fireEvent('updateproperty', store, rec, operation, modifiedFieldNames, eOpts);
                            }
                       }
                    }),
            columns: {
                defaults: {
                    sortable : false,
                    draggable: false,
                    hideable : false,
                    flex     : 2
                },
                items: [
                    {
                        text     : NP.Config.getPropertyLabel(),
                        dataIndex: 'property_id',
                        itemId   : 'propertyCol',
                        renderer : function(val, meta) {
                            var rec = Ext.getStore('property.AllProperties').findRecord('property_id', val, 0, false, false, true);
                            
                            meta.tdCls = '';
                            meta.tdAttr = '';
                            if (rec) {
                                if (rec.get('property_status') !== 1) {
                                    meta.tdCls = 'grid-invalid-cell';
                                    var tooltipMsg = (rec.get('property_status') == 0) ? that.propInactiveError : that.propOnHoldError
                                    meta.tdAttr = 'data-qtip="' + tooltipMsg + '"';
                                }
                                return rec.get('property_name');
                            } else {
                                return '';
                            }
                        },
                        editor: {
                            xtype     : 'shared.propertycombo',
                            itemId    : 'splitGridPropertyCombo',
                            store     : propStore,
                            hideLabel : true
                        }
                    },{
                        text: this.glAccountColText,
                        dataIndex: 'glaccount_id',
                        renderer: function(val, meta) {
                            var rec = Ext.getStore('gl.AllGlAccounts').findRecord('glaccount_id', val, 0, false, false, true);
                            
                            meta.tdCls = '';
                            meta.tdAttr = '';
                            if (rec) {
                                if (rec.get('glaccount_status') === 'inactive') {
                                    meta.tdCls = 'grid-invalid-cell';
                                    meta.tdAttr = 'data-qtip="' + that.glInactiveError + '"';
                                }
                                return rec.get('display_name');
                            } else {
                                return '';
                            }
                        },
                        editor: {
                            xtype    : 'shared.glcombo',
                            itemId   : 'splitGridGlCombo',
                            store    : glStore,
                            hideLabel: true
                        }
                    }
                ]
            }
        };

        // Add columns to grid that depend on config
        if (NP.Config.getSetting('PN.InvoiceOptions.AllowUnitAttach') == '1') {
            var unitStore = Ext.create('NP.store.property.Units', {
                           service    : 'PropertyService',
                           action     : 'getUnits',
                           extraParams: {
                                unit_status: 'active'
                           }
                        });

            gridConfig.columns.items.push({
                text     : NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit'),
                dataIndex: 'unit_id',
                flex     : 1,
                renderer : function(val) {
                    var rec = Ext.getStore('property.AllUnits').findRecord('unit_id', val, 0, false, false, true);
                    if (rec) {
                        return rec.get('unit_number');
                    } else {
                        return '';
                    }
                },
                editor: {
                    xtype    : 'shared.unitcombo',
                    itemId   : 'splitGridUnitCombo',
                    store    : unitStore,
                    hideLabel: true
                }
            });
        }
        
        // Add custom fields to grid
        var customFields = NP.Config.getCustomFields().line.fields;
        Ext.Object.each(customFields, function(fieldNum, fieldObj) {
            if (fieldObj.invOn) {
                gridConfig.columns.items.push({
                    text     : fieldObj.label,
                    flex     : 1,
                    dataIndex: 'universal_field' + fieldNum,
                    editor   : {
                        xtype     : 'shared.customfield',
                        hideLabel : true,
                        entityType: 'customInvoicePO',
                        type      : (fieldNum > 6) ? 'text' : 'select',
                        name      : 'universal_field' + fieldNum,
                        number    : fieldNum,
                        allowBlank: !fieldObj.invRequired
                    }
                });
            }
        });

        // Add last columns of grid
        gridConfig.columns.items.push(
            {
                xtype    : 'numbercolumn',
                text     : this.percentColText,
                dataIndex: 'dfsplititem_percent',
                align    : 'right',
                renderer : function(val) {
                    if (val !== '') {
                        return val.toFixed(4) + '%';
                    }

                    return val;
                },
                flex  : 1,
                editor: {
                    xtype           : 'numberfield',
                    decimalPrecision: 4,
                    minValue        : 0.0001,
                    maxValue        : 100
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    var span = (100-Ext.Number.toFixed(value, 4) == 0) ? '' : '<span style="color:#FF0000;">';
                    return that.leftToAllocateText + ': ' + span + Ext.util.Format.number(100-value, '0.0000%') + '</span>';
                }
            },{
                xtype: 'actioncolumn',
                flex: 0.1,
                align: 'center',
                items: [{
                    icon: 'resources/images/buttons/delete.gif',
                    iconCls: 'pointer',
                    tooltip: 'Delete',
                    handler: function(gridView, rowIndex, colIndex) {
                        var grid = gridView.ownerCt;
                        grid.fireEvent('deleterow', grid, grid.getStore().getAt(rowIndex), rowIndex);
                    }
                }]
            }
        );

        this.items.push(gridConfig);

        this.callParent(arguments);
        
        this.query('customgrid')[0].addEvents('deleterow','updateproperty');
    },

    isValid: function() {
        var that = this;

        var isValid = this.callParent(arguments);

        var grid = this.query('customgrid')[0];
        var recs = grid.getStore().getRange();

        var allocTotal = 0;
        var errors = [];
        var hasPropertyError = false;
        // Loop through allocation lines to sum percentages and check if a property is set
        Ext.Array.each(recs, function(rec, row) {
            // Add to the percentage total
            if (rec.get('dfsplititem_percent') !== null) {
                allocTotal += rec.get('dfsplititem_percent');
            }

            var cell = grid.getView().getCell(rec, Ext.ComponentQuery.query('#propertyCol')[0]);
            cell = Ext.create('Ext.dom.Element', cell);
            if (rec.get('property_id') === null) {
                cell.addCls('grid-invalid-cell');
                if (!hasPropertyError) {
                    errors.push(that.propertyErrorText);
                    hasPropertyError = true;
                }
            } else {
                cell.removeCls('grid-invalid-cell');
            }
        });

        if (Ext.Number.toFixed(allocTotal, 4) != 100) {
            errors.push(this.allocationErrorText);
        }

        var errorField = this.findField('allocationErrors');
        if (errors.length) {
            errors = errors.join('<br />');
            errorField.inputEl.addCls('error-text');
            errorField.setValue(errors);
            errorField.show();
        } else {
            errorField.hide();
        }

        return (!isValid || errors.length) ? false : true;
    }
});