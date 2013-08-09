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
    	'NP.view.shared.button.Cancel',
        'NP.view.shared.button.New',
        'NP.view.shared.button.Reset',
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
    splitNameLabel     : 'Split Name',
    intPkgFieldLabel   : 'Integration Package',
    allocationGridTitle: 'Allocation Details',
    glAccountColText   : 'GL Account',
    percentColText     : 'Percentage',
    addSplitBtnText    : 'Add Split',
    leftToAllocateText : 'Left to allocate',
    
    initComponent: function() {
    	var that = this;

    	var bar = [
    		{ xtype: 'shared.button.save', itemId: 'saveSplitFormBtn' },
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
                }
            ]
        }];

        var gridConfig = {
            xtype: 'customgrid',
            title: this.allocationGridTitle,
            emptyText: 'No split allocation lines',
            flex : 1,
            border: '1 0 0 0',
            tbar: [
                { xtype: 'shared.button.new', itemId: 'addSplitAllocBtn', text: this.addSplitBtnText, disabled: true }
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
                        renderer : function(val) {
                            var rec = Ext.getStore('property.AllProperties').findRecord('property_id', val, 0, false, false, true);
                            
                            if (rec) {
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
                        renderer: function(val) {
                            var rec = Ext.getStore('gl.AllGlAccounts').findRecord('glaccount_id', val, 0, false, false, true);
                            if (rec) {
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
                xtype: 'numbercolumn',
                text: this.percentColText,
                dataIndex: 'dfsplititem_percent',
                align: 'right',
                renderer: function(val) {
                    if (val !== '') {
                        return val + '%';
                    }

                    return val;
                },
                flex : 1,
                editor: {
                    xtype           : 'numberfield',
                    decimalPrecision: 4,
                    minValue        : 0.0001,
                    maxValue        : 100
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return that.leftToAllocateText + ': ' + Ext.util.Format.number(100-value, '0.0000%');
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
        var isValid = this.callParent(arguments);

        var grid = this.query('customgrid')[0];
        var recs = grid.getStore().getRange();

        var allocTotal = 0;
        var errors = {};
        Ext.Array.each(recs, function(rec) {
            if (rec.get('dfsplititem_percent') !== null) {
                allocTotal += rec.get('dfsplititem_percent');
            }
            if (!'property' in errors && rec.get('property_id') === null) {
                errors['property'] = true;
            }
        });
        if (allocTotal != 100) {

        }
    }
});