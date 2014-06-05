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
        'NP.store.gl.GlAccountTypes',
        'NP.store.gl.GlAccounts',
        'NP.view.shared.PropertyCombo',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.New',
        'NP.view.shared.button.Edit'
    ],
    // For localization
    intPkgText        : 'Integration Package',
    createNewText     : 'Create New',
    nameColText       : 'GL Name',
    numberColText     : 'GL Number',
    categoryColText   : 'Category',
    typeColText       : 'Type',
    statusColText     : 'Status',
    lastUpdatedColText: 'Last Updated',
    
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    border: false,

    initComponent: function() {
        var that = this,
            bar  = [
                {xtype: 'shared.button.cancel'},
                {xtype: 'shared.button.new', text: this.createNewText}
            ],
            filterLabelWidth = 135,
            filterButtonWidth = 120;

        this.tbar = bar;
        this.bbar = bar;

        // Let's explicitely create this one, otherwise it seems Ext gets confused because there's
        // another GlAccounts store being used
        var glStore = Ext.create('NP.store.gl.GlAccounts', {
            service    : 'GLService',
            action     : 'getAllGLAccounts',
            paging     : true,
            extraParams: {
                glaccount_from    	: null,
                glaccount_to      	: null,
                glaccount_status  	: null,
                property_id       	: null,
                glaccounttype_id  	: null,
                glaccount_category	: null,
				glaccount_name		: null
            }
        });

        this.items = [
            {
                xtype: 'panel',
                layout: 'column',
                border: false,
                margin: '0 8 8 8',
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
                        xtype      : 'container',
                        columnWidth: 0.5,
                        layout     : 'form',
                        defaults   : {
                            labelAlign: 'left',
                            labelWidth: filterLabelWidth
                        },
                        items: [
							{
								xtype       : 'customcombo',
								fieldLabel  : this.intPkgText,
								labelWidth  : filterLabelWidth,
								store       : 'system.IntegrationPackages',
								name        : 'integration_package_id',
								displayField: 'integration_package_name',
								valueField  : 'integration_package_id',
								emptyText   : 'All',
								margin      : '8 8 0 8',
								labelAlign  : 'left'
							},
                            {
                                xtype     : 'textfield',
                                name      : 'glaccount_from',
                                fieldLabel: 'From'
                            },{
                                xtype     : 'customcombo',
                                name      : 'glaccount_status',
                                fieldLabel: 'Status',
                                labelWidth: filterLabelWidth,
                                store     : Ext.create('Ext.data.Store', {
                                    fields: ['name', 'value'],
                                    data: [
                                        {name: 'Active', value: 'active'},
                                        {name: 'Inactive', value: 'inactive'}
                                    ]
                                }),
                                displayField: 'name',
                                valueField  : 'value',
                                emptyText   : 'All'
                            },{
                                xtype     : 'customcombo',
                                name      : 'glaccounttype_id',
                                fieldLabel: 'Type',
                                labelWidth: filterLabelWidth,
                                store     : {
                                    type    : 'gl.glaccounttypes',
                                    service : 'GLService',
                                    action  : 'getTypes',
                                    autoLoad: true
                                },
                                displayField: 'glaccounttype_name',
                                valueField  : 'glaccounttype_id',
                                emptyText   : 'All'
                            }
                        ]
                    },{
                        xtype      : 'container',
                        columnWidth: 0.5,
                        margin     : '0 0 0 16',
                        layout     : 'form',
                        items      : [
                            {
                                xtype     : 'textfield',
                                name      : 'glaccount_name',
                                fieldLabel: 'Name'
                            },
                            {
                                xtype     : 'textfield',
                                name      : 'glaccount_to',
                                fieldLabel: 'To'
                            },{
                                xtype                : 'shared.propertycombo',
                                emptyText            : 'All',
                                loadStoreOnFirstQuery: true,
                                labelWidth           : filterLabelWidth
                            },{
                                xtype     : 'customcombo',
                                name      : 'glaccount_category',
                                fieldLabel: 'Category',
                                labelWidth: filterLabelWidth,
                                store     : {
                                    type       : 'gl.glaccounts',
                                    service    : 'GLService',
                                    action     : 'getCategories',
                                    extraParams: {
                                        getInUseOnly: true
                                    },
                                    autoLoad   : true
                                },
                                displayField: 'glaccount_name',
                                valueField  : 'tree_id',
                                emptyText   : 'All',
								tpl: new Ext.XTemplate(
									'<tpl for="." >',
										'<div class="x-boundlist-item">',
											'{glaccount_name} ',
											'<tpl if="glaccount_status == \'inactive\'">',
												'(Inactive)',
											'</tpl>',
										'</div>',
									'</tpl>')
                            }
                        ]
                    }
                ]
            },
            {
                xtype   : 'customgrid',
                borde   : false,
                paging  : true,
                flex    : 1,
                selModel: Ext.create('Ext.selection.CheckboxModel'),
                stateful: true,
                stateId : 'glaccount_setup_grid',
                store   : glStore,
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
                        flex: 1
                    },
                    {
                        text: this.intPkgText,
                        dataIndex: 'integration_package_name',
                        flex: 1
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
                              var returnVal = Ext.Date.format(val, NP.Config.getDefaultDateTimeFormat());
                              if (rec.get('userprofile_username') != null) {
                                  returnVal += ' (' + rec.get('userprofile_username') + ')'
                              }

                              return returnVal;
                          },
                          flex : 1.5
                    }
                ],
                pagingToolbarButtons: [
                    {
                        xtype   : 'shared.button.edit',
                        itemId  : 'editGLAccountsBtn',
                        disabled: true
                    },
                    {
                        xtype   : 'shared.button.activate',
                        itemId  : 'activateGLAccountsBtn',
                        disabled: true
                    },
                    {
                        xtype   : 'shared.button.inactivate',
                        itemId  : 'inactivateGLAccountsBtn',
                        disabled: true
                    },{
                        xtype   : 'button',
                        text    : 'Distribute to All Vendors',
                        itemId  : 'distributeToAllVendorsBtn',
                        disabled: true
                    },{ 
                        xtype   : 'button', 
                        text    : 'Distribute to All Properties', 
                        itemId  : 'distributeToAllPropertiesBtn',
                        hidden  : (NP.Config.getSetting('CP.PROPERTYGLACCOUNT_USE', 0) == 0 && NP.Security.hasPermission(12)) ? true : false,
                        disabled: true 
                    }
                ]   
            }
        ];
        this.callParent(arguments);
        
        this.intPkgFilter   = this.query('[name="integration_package_id"]')[0];
        this.fromFilter     = this.query('[name="glaccount_from"]')[0];
        this.toFilter       = this.query('[name="glaccount_to"]')[0];
        this.statusFilter   = this.query('[name="glaccount_status"]')[0];
        this.propertyFilter = this.query('[name="property_id"]')[0];
        this.typeFilter     = this.query('[name="glaccounttype_id"]')[0];
        this.categoryFilter = this.query('[name="glaccount_category"]')[0];
        this.nameFilter = this.query('[name="glaccount_name"]')[0];

        this.filterFields = ['intPkgFilter','fromFilter','toFilter','statusFilter', 'propertyFilter', 'typeFilter', 'categoryFilter', 'nameFilter'];
    },

    applyFilter: function() {
        var me   = this,
            grid          = me.query('customgrid')[0],
            currentParams = grid.getStore().getProxy().extraParams,
            newParams     = {};

        Ext.each(me.filterFields, function(fieldName) {
            newParams[me[fieldName].getName()] = me[fieldName].getValue();
        });

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