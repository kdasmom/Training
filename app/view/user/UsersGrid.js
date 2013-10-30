/**
 * User Manager > Users tab > User Grid
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.UsersGrid', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.user.usersgrid',

    requires: [
    	'NP.lib.core.Config',
        'NP.lib.core.Translator',
    	'NP.view.shared.button.New',
    	'NP.view.shared.button.Inactivate',
    	'NP.view.shared.button.Activate',
        'NP.lib.ui.Grid',
        'NP.lib.ui.ComboBox',
        'NP.view.shared.PropertyCombo'
    ],
    
    layout: {
        type : 'vbox',
        align: 'stretch'
    },
    border: false,
    
    initComponent: function() {
    	var that = this;

    	var bar = [
    		{ xtype: 'shared.button.new', text: NP.Translator.translate('Create New User') }
	    ];
	    this.tbar = bar;
	    this.bbar = bar;

        var filterLabelWidth = 80;
        var filterButtonWidth = 120;
        this.items = [
            {
                xtype   : 'panel',
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
                    layout: { pack: 'center' },
                    items: [
                        {
                            xtype: 'button',
                            text: 'Filter',
                            width: filterButtonWidth,
                            handler: Ext.bind(this.applyFilter, this)
                        },{
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
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [
                            {
                                xtype     : 'customcombo',
                                name      : 'userprofile_status',
                                fieldLabel: NP.Translator.translate('Status'),
                                labelWidth: filterLabelWidth,
                                store     : Ext.create('Ext.data.Store', {
                                            fields: ['name','value'],
                                            data  : [
                                                { name: 'Active', value: 'active' },
                                                { name: 'Inactive', value: 'inactive' }
                                            ]
                                        }),
                                displayField: 'name',
                                valueField  : 'value',
                                emptyText   : 'All'
                            },{
                                xtype                : 'shared.propertycombo',
                                emptyText            : 'All',
                                loadStoreOnFirstQuery: true,
                                labelWidth           : filterLabelWidth
                            }
                        ]
                    },{
                        xtype: 'container',
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [
                            {
                                xtype       : 'customcombo',
                                name        : 'role_id',
                                fieldLabel  : NP.Translator.translate('Group'),
                                labelWidth  : filterLabelWidth,
                                store       : 'user.RoleTree',
                                valueField  : 'role_id',
                                displayField: 'role_name',
                                emptyText   : 'All',
                                tpl         : 
                                    '<tpl for=".">' +
                                        '<li class="x-boundlist-item">' +
                                            '{indent_text}{role_name}' +
                                        '</li>' +
                                    '</tpl>'
                            },{
                                xtype       : 'customcombo',
                                name        : 'module_id',
                                fieldLabel  : NP.Translator.translate('Function'),
                                labelWidth  : filterLabelWidth,
                                store       : 'security.ModuleTree',
                                valueField  : 'module_id',
                                displayField: 'module_name',
                                emptyText   : 'All',
                                tpl         : 
                                    '<tpl for=".">' +
                                        '<li class="x-boundlist-item">' +
                                            '{indent_text}{module_name}' +
                                        '</li>' +
                                    '</tpl>'
                            }
                        ]
                    }
                ]
            },{
                xtype   : 'customgrid',
                border  : false,
                paging  : true,
                flex    : 1,
                selModel: Ext.create('Ext.selection.CheckboxModel'),
                stateful: true,
                stateId : 'user_manager_user_grid',
                store   : Ext.create('NP.store.user.Userprofiles', {
                            service           : 'UserService',
                            action            : 'getAll',
                            paging            : true,
                            extraParams: {
                                userprofile_status: null,
                                property_id       : null,
                                role_id           : null,
                                module_id         : null
                            }
                        }),
                columns : [
                    {
                        text: NP.Translator.translate('Name'),
                        dataIndex: 'person_lastname',
                        flex: 1,
                        renderer: function(val, meta, rec) {
                            return rec.get('person_lastname') + ', ' + rec.get('person_firstname');
                        }
                    },{
                        text: NP.Translator.translate('Group'),
                        dataIndex: 'role_name',
                        flex: 1,
                        tdCls: 'grid-clickable-col'
                    },{
                        text: NP.Translator.translate('Username'),
                        dataIndex: 'userprofile_username',
                        flex: 0.5
                    },{
                        text: NP.Translator.translate('Last Updated'),
                        dataIndex: 'userprofile_updated_datetm',
                        flex: 1,
                        renderer: function(val, meta, rec) {
                            val = Ext.Date.format(val, NP.Config.getDefaultDateFormat() + ' h:iA');
                            if (rec.get('userprofile_updated_by') !== null) {
                                val += ' (' + rec.get('updated_by_userprofile_username') + ')'
                            }
                            return val;
                        }
                    },{
                        text: NP.Translator.translate('Status'),
                        dataIndex: 'userprofile_status',
                        flex: 0.5,
                        renderer: Ext.util.Format.capitalize
                    }
                ],
                pagingToolbarButtons: [
                    { xtype: 'shared.button.activate', disabled: true },
                    { xtype: 'shared.button.inactivate', disabled: true }
                ]
            }
        ];

    	this.callParent(arguments);

        this.statusFilter   = this.query('[name="userprofile_status"]')[0];
        this.propertyFilter = this.query('[name="property_id"]')[0];
        this.roleFilter     = this.query('[name="role_id"]')[0];
        this.moduleFilter   = this.query('[name="module_id"]')[0];

        this.filterFields = ['statusFilter','propertyFilter','roleFilter','moduleFilter'];
    },

    applyFilter: function() {
        var that = this;

        var grid = this.query('customgrid')[0];

        var currentParams = grid.getStore().getProxy().extraParams;
        var newParams = {
            userprofile_status: this.statusFilter.getValue(),
            property_id       : this.propertyFilter.getValue(),
            role_id           : this.roleFilter.getValue(),
            module_id         : this.moduleFilter.getValue()
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