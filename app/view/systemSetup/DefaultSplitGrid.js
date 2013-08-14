/**
 * System Setup > Default Splits tab > Default Splits Grid
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.systemSetup.DefaultSplitGrid', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.systemsetup.defaultsplitgrid',

    requires: [
    	'NP.lib.core.Config',
    	'NP.view.shared.button.New',
    	'NP.view.shared.button.Delete',
        'NP.lib.ui.Grid',
        'NP.view.shared.PropertyCombo',
        'NP.view.shared.GlCombo'
    ],
    
    // For localization
    createNewSplitBtnLabel: 'Create New Split',
    nameColText           : 'Name',
    createdDateColText    : 'Created Date',
    lastUpdatedColText    : 'Last Updated',
    alertColText          : 'Alert',
    inactiveText          : 'Inactive',
    onHoldText            : 'On Hold',
    glText                : 'GL',

    layout: {
        type : 'vbox',
        align: 'stretch'
    },
    border: false,
    
    initComponent: function() {
    	var that = this;

    	var bar = [
    		{ xtype: 'shared.button.new', text: this.createNewSplitBtnLabel }
	    ];
	    this.tbar = bar;
	    this.bbar = bar;

        var filterLabelWidth = 80;
        var filterButtonWidth = 120;
        this.items = [
            {
                xtype   : 'panel',
                layout  : 'column',
                border  : false,
                margin  : '8 0 8 0',
                defaults: {
                    margin: '0 16 0 16'
                },
                dockedItems: {
                    xtype : 'toolbar',
                    dock  : 'bottom',
                    ui    : 'footer',
                    layout: { pack: 'center' },
                    items : [
                        {
                            xtype  : 'button',
                            text   : 'Filter',
                            width  : filterButtonWidth,
                            handler: Ext.bind(this.applyFilter, this)
                        },{
                            xtype  : 'button',
                            text   : 'Reset',
                            width  : filterButtonWidth,
                            margin : '0 0 0 5',
                            handler: Ext.bind(this.clearFilter, this)
                        }
                    ]
                },
                items: [
                    {
                        xtype                : 'shared.propertycombo',
                        emptyText            : 'All',
                        loadStoreOnFirstQuery: true,
                        labelWidth           : filterLabelWidth,
                        columnWidth          : 0.5
                    },{
                        xtype                : 'shared.glcombo',
                        emptyText            : 'All',
                        loadStoreOnFirstQuery: true,
                        labelWidth           : filterLabelWidth,
                        columnWidth          : 0.5
                    }
                ]
            },{
                xtype   : 'customgrid',
                border  : false,
                paging  : true,
                flex    : 1,
                selModel: Ext.create('Ext.selection.CheckboxModel'),
                stateful: true,
                stateId : 'default_splits_grid',
                store   : Ext.create('NP.store.system.DfSplits', {
                            service    : 'SplitService',
                            action     : 'getByFilter',
                            paging     : true,
                            extraParams: {
                                glaccount_id: null,
                                property_id : null
                            }
                        }),
                columns : [
                    {
                        text     : this.nameColText,
                        dataIndex: 'dfsplit_name',
                        flex     : 5
                    },{
                        text     : this.createdDateColText,
                        xtype    :'datecolumn',
                        dataIndex: 'dfsplit_datetm',
                        flex     : 1
                    },{
                        text     : this.lastUpdatedColText,
                        dataIndex: 'dfsplit_update_datetm',
                        flex     : 2,
                        renderer : function(val, meta, rec) {
                            val = Ext.Date.format(val, NP.Config.getDefaultDateFormat() + ' h:iA');
                            if (rec.get('dfsplit_update_userprofile') !== null) {
                                val += ' (' + rec.getUpdater().get('userprofile_username') + ')'
                            }
                            return val;
                        }
                    },{
                        text     : this.alertColText,
                        dataIndex: 'alert',
                        flex     : 1,
                        renderer : function(val, meta, rec) {
                            if (val == 'propInactive') {
                                return that.inactiveText + ' ' + NP.Config.getPropertyLabel();
                            } else if (val == 'propOnHold') {
                                return that.onHoldText + ' ' + NP.Config.getPropertyLabel();
                            } else if (val == 'glInactive') {
                                return that.inactiveText + ' ' + that.glText;
                            }
                        }
                    }
                ],
                pagingToolbarButtons: [
                    { xtype: 'shared.button.delete', disabled: true }
                ]
            }
        ];

    	this.callParent(arguments);

        this.propertyFilter = this.query('[name="property_id"]')[0];
        this.glFilter       = this.query('[name="glaccount_id"]')[0];

        this.filterFields = ['propertyFilter','glFilter'];
    },

    applyFilter: function() {
        var that = this;

        var grid = this.query('customgrid')[0];

        var currentParams = grid.getStore().getProxy().extraParams;
        var newParams = {
            property_id : this.propertyFilter.getValue(),
            glaccount_id: this.glFilter.getValue()
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
            that[field].clearValue();
        });

        this.applyFilter();
    }
});