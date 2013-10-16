/**
 * GL Account Setup > GL Accounts
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.gl.GLAccountsGrid', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.gl.glaccountsgrid',
    requires: [
        'NP.lib.core.Config',
        'NP.lib.ui.Grid',
        'NP.lib.ui.ComboBox',
        'NP.view.shared.PropertyCombo',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.New',
        'NP.view.shared.button.Edit'
    ],
    // For localization
    createNewText: 'Create New',
    nameColText: 'GL Name',
    numberColText: 'GL Number',
    categoryColText: 'Category',
    typeColText: 'Type',
    statusColText: 'Status',
    lastUpdatedColText: 'Last Updated',
    
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    border: false,
    initComponent: function() {
        var that = this;

        var bar = [
            {xtype: 'shared.button.cancel'},
            {xtype: 'shared.button.new', text: this.createNewText}
        ];
        this.tbar = bar;
        this.bbar = bar;

        var filterLabelWidth = 80;
        var filterButtonWidth = 120;
        
        var glTypeStore = Ext.create('NP.store.gl.GlAccountTypes', {
            service : 'GLService',
            action  : 'getTypes'
        });
        glTypeStore.load();
        
        var glCategoryStore = Ext.create('NP.store.gl.GlAccounts', {
            service : 'GLService',
            action  : 'getCategories'
        });
        glCategoryStore.load();
        
        var glAccountsStore = Ext.create('NP.store.gl.GlAccounts', {
                    service: 'GLService',
                    action: 'getAllGLAccounts',
                    paging: true,
                    extraParams: {
                            glaccount_from    : null,
                            glaccount_to      : null,
                            glaccount_status  : null,
                            property_id       : null,
                            glaccounttype_id  : null,
                            glaccount_category: null
                        }
                });
        glAccountsStore.load();
        
        var pagingToolbarButtons = [
                    { xtype: 'shared.button.edit', itemId: 'editGLAccountsBtn', disabled: true },
                    { xtype: 'button', text: 'Distribute to All Vendors', itemId: 'distributeToAllVendorsBtn', disabled: true },
        ];
        
        this.items = [
            {
                xtype: 'panel',
                layout: 'column',
                border: false,
                margin: '0 0 8 0',
                defaults: {
                    margin: '0 16 0 16'
                },
                dockedItems: {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    ui: 'footer',
                    layout: {pack: 'center'},
                    items: [
                        {
                            xtype: 'button',
                            text: 'Filter',
                            width: filterButtonWidth,
                            handler: Ext.bind(this.applyFilter, this)
                        }, {
                            xtype: 'button',
                            text: 'Reset',
                            width: filterButtonWidth,
                            margin: '0 0 0 5',
                            handler: Ext.bind(this.clearFilter, this)
                        }
                    ]
                },
                items: [
                     {
                        xtype: 'container',
                        columnWidth: 1,
                        layout: 'column',
                        margin: '8 0 0 0',
                         defaults: {
                            xtype     : 'textfield',
                            columnWidth: 0.5,
                            labelAlign: 'left',
                            labelWidth: filterLabelWidth,
                            margin    : '0 16 0 16'
                        },
                        items: [
                            {
                                name: 'glaccount_from',
                                fieldLabel: 'From'
                            }, {
                                name: 'glaccount_to',
                                fieldLabel: 'To'
                            }
                        ]
                    }, {
                        xtype: 'container',
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'customcombo',
                                name: 'glaccount_status',
                                fieldLabel: 'Status',
                                labelWidth: filterLabelWidth,
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['name', 'value'],
                                    data: [
                                        {name: 'Active', value: 'active'},
                                        {name: 'Inactive', value: 'inactive'}
                                    ]
                                }),
                                displayField: 'name',
                                valueField: 'value',
                                emptyText: 'All'
                            }, {
                                xtype: 'shared.propertycombo',
                                emptyText: 'All',
                                loadStoreOnFirstQuery: true,
                                labelWidth: filterLabelWidth
                            }
                        ]
                    }, {
                        xtype: 'container',
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'customcombo',
                                name: 'glaccounttype_id',
                                fieldLabel: 'Type',
                                labelWidth: filterLabelWidth,
                                store: glTypeStore,
                                displayField: 'glaccounttype_name',
                                valueField: 'glaccounttype_id',
                                emptyText: 'All'
                            }, 
                            {
                                xtype: 'customcombo',
                                name: 'glaccount_category',
                                fieldLabel: 'Category',
                                labelWidth: filterLabelWidth,
                                store: glCategoryStore,
                                displayField: 'glaccount_name',
                                valueField: 'glaccount_name',
                                emptyText: 'All'
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'customgrid',
                borde: false,
                paging: true,
                flex: 1,
                selModel: Ext.create('Ext.selection.CheckboxModel'),
                stateful: true,
                stateId: 'glaccount_setup_grid',
                store: glAccountsStore,
                columns: [
                    {
                        text: this.numberColText,
                        dataIndex: 'glaccount_number',
                        flex: 1
                    },
                    {
                        text: this.nameColText,
                        dataIndex: 'glaccount_name',
                        flex: 1
                    },
                    {
                        text: this.categoryColText,
                        dataIndex: 'glaccount_category',
                        flex: 1,
                        renderer: function(val, meta, rec) {
                            return rec.raw['glaccount_category']
                        }
                    },
                    {
                        text: this.typeColText,
                        dataIndex: 'glaccounttype_name',
                        flex: 1,
                        renderer: function(val, meta, rec) {
                            return rec.getType().get('glaccounttype_name')
                        }
                    },
                    {
                        text: this.statusColText,
                        dataIndex: 'glaccount_status',
                        flex: 0.5,
                        renderer: Ext.util.Format.capitalize
                    },
                    {
                        text: this.lastUpdatedColText,
                        dataIndex: 'glaccount_updatetm',
                        renderer: function(val, meta, rec) {
                              var returnVal = Ext.Date.format(val, NP.Config.getDefaultDateFormat() + ' h:iA');
                              if (rec.get('glaccount_updateby') != null) {
                                  returnVal += ' (' + rec.getUpdatedByUser().get('userprofile_username') + ')'
                              }

                              return returnVal;
                          },
                          flex : 1.5
                    }
                ],
                pagingToolbarButtons: pagingToolbarButtons
            }
        ];
        if (NP.Config.getSetting('CP.PROPERTYGLACCOUNT_USE', 0) == 0 && NP.Security.hasPermission(12)) {
                     pagingToolbarButtons.push(
                             { 
                                xtype: 'button', 
                                text: 'Distribute to All Properties', 
                                itemId: 'distributeToAllPropertiesBtn',
                                disabled: true 
                            });       
        }       
        this.callParent(arguments);
        
        this.fromFilter = this.query('[name="glaccount_from"]')[0];
        this.toFilter = this.query('[name="glaccount_to"]')[0];
        this.statusFilter = this.query('[name="glaccount_status"]')[0];
        this.propertyFilter = this.query('[name="property_id"]')[0];
        this.typeFilter = this.query('[name="glaccounttype_id"]')[0];
        this.categoryFilter = this.query('[name="glaccount_category"]')[0];

        this.filterFields = ['fromFilter','toFilter','statusFilter', 'propertyFilter', 'typeFilter', 'categoryFilter'];

    },
    applyFilter: function() {
        var that = this;
         
        var grid = this.query('customgrid')[0];

        var currentParams = grid.getStore().getProxy().extraParams;
        var newParams = {
            glaccount_from: this.fromFilter.getValue(),
            glaccount_to: this.toFilter.getValue(),
            glaccount_status: this.statusFilter.getValue(),
            property_id: this.propertyFilter.getValue(),
            glaccounttype_id: this.typeFilter.getValue(),
            glaccount_category: this.categoryFilter.getValue()
        };

        Ext.Object.each(newParams, function(key, val) {
            if (currentParams[key] !== newParams[key]) {
                grid.getStore().addExtraParams(newParams);
                grid.reloadFirstPage();

                return false;
            }
        });
    },
    clearFilter: function() {
        var that = this;

        Ext.Array.each(this.filterFields, function(field) {
            if (that[field].xtype != 'textfield') {
                that[field].clearValue();
            } else {
                that[field].setValue('');
            }              
        });

        this.applyFilter();
    }
});