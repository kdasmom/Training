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
        'NP.lib.ui.Grid',
        'NP.lib.ui.ComboBox',
        'NP.view.shared.VendorAutoComplete',
        'NP.view.shared.PropertyCombo',
        'NP.view.shared.GlCombo',
        'NP.model.gl.GlAccount'
    ],

    layout: {
        type : 'vbox',
        align: 'stretch'
    },
    border: false,

    // For localization
    intPkgFieldLabel   : 'Integration Package',
    allocationGridTitle: 'Allocation Details',
    glAccountColText   : 'GL Account',
    percentColText     : 'Percentage',
    addSplitBtnText    : 'Add Split',
    
    initComponent: function() {
    	var that = this;

    	var bar = [
    		{ xtype: 'shared.button.save' },
    		{ xtype: 'shared.button.cancel' }
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

        this.items = [
            {
                xtype: 'container',
                margin: 8,
                defaults: {
                    labelWidth: 175,
                    width     : 500
                },
                items: [
                    {
                        xtype            : 'customcombo',
                        fieldLabel       : this.intPkgFieldLabel,
                        name             : 'integration_package_id',
                        store            : 'system.IntegrationPackages',
                        displayField     : 'integration_package_name',
                        valueField       : 'integration_package_id',
                        selectFirstRecord: true
                    },{
                        xtype       : 'shared.vendorautocomplete',
                        allowBlank  : true,
                        emptyText   : 'All',
                        store       : Ext.create('NP.store.vendor.Vendors', {
                                        service: 'VendorService',
                                        action: 'getByIntegrationPackage'
                                    })
                    }
                ]
            },{
                xtype: 'customgrid',
                title: this.allocationGridTitle,
                flex : 1,
                border: '1 0 0 0',
                tbar: [
                    { xtype: 'shared.button.new', text: this.addSplitBtnText }
                ],
                plugins: [
                    Ext.create('Ext.grid.plugin.CellEditing', { clicksToEdit: 1 })
                ],
                store  : Ext.create('NP.store.system.DfSplitItems', {
                            service: 'SplitService',
                            action : 'getSplitItems'
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
                                xtype: 'shared.propertycombo',
                                itemId: 'splitGridPropertyCombo',
                                store: propStore,
                                hideLabel: true
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
                                xtype: 'shared.glcombo',
                                itemId: 'splitGridGlCombo',
                                store: glStore,
                                hideLabel: true
                            }
                        },{
                            text: this.percentColText,
                            dataIndex: 'dfsplititem_percent',
                            flex : 1,
                            editor: {
                                xtype: 'numberfield'
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
                    ]
                }
            }
        ];

        this.callParent(arguments);
        
        this.query('customgrid')[0].addEvents('deleterow');
    }
});