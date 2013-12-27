/**
 * User Manager > Groups tab > Group Grid
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.GroupsGrid', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.user.groupsgrid',

    requires: [
    	'NP.lib.core.Config',
        'NP.lib.core.Translator',
    	'NP.view.shared.button.New',
    	'NP.view.shared.button.Delete',
        'NP.lib.ui.Grid',
        'NP.store.user.Roles'
    ],
    
    layout: 'fit',
    border: false,
    
    initComponent: function() {
    	var that = this;

    	var bar = [
    		{ xtype: 'shared.button.new', text: NP.Translator.translate('Create New Group') }
	    ];
	    this.tbar = bar;

        this.items = [{
            xtype   : 'customgrid',
            border  : false,
            paging  : true,
            stateful: true,
            stateId : 'user_manager_group_grid',
            store   : Ext.create('NP.store.user.Roles', {
                        service: 'UserService',
                        action : 'getRolesByModule',
                        paging : true
                    }),
            columns : [
                {
                    text: NP.Translator.translate('Name'),
                    dataIndex: 'role_name',
                    flex: 1,
					hideable: false
                },{
                    text: NP.Translator.translate('Users'),
                    dataIndex: 'role_user_count',
                    flex: 1
                },{
                    text: NP.Translator.translate('Last Updated'),
                    dataIndex: 'role_updated_datetm',
                    flex: 1,
                    renderer: function(val, meta, rec) {
                        val = Ext.Date.format(val, NP.Config.getDefaultDateFormat() + ' h:iA');
                        if (rec.get('userprofile_username') !== null) {
                            val += ' (' + rec.get('userprofile_username') + ')'
                        }
                        return val;
                    }
                },
				{
					text: NP.Translator.translate('Group Parent'),
					dataIndex: 'parent_role_name',
					flex: 1,
					renderer: function (val, meta, rec) {
						return rec.raw['parent_role_name'];
					},
					hidden: true
				}
            ],
            pagingToolbarButtons: [
                NP.Translator.translate('Function') + ':',
                {
                    xtype       : 'customcombo',
                    name        : 'module_id',
                    store       : 'security.ModuleTree',
                    width       : 350,
                    labelWidth  : 60,
                    valueField  : 'module_id',
                    displayField: 'module_name',
                    emptyText   : 'All',
                    listeners: {
                        change: Ext.bind(this.applyModuleFilter, this)
                    },
                    tpl         :
                        '<tpl for=".">' +
                            '<li class="x-boundlist-item">' +
                                '{indent_text}{module_name}' +
                            '</li>' +
                        '</tpl>'
                }
            ]
        }];

    	this.callParent(arguments);
    },

    applyModuleFilter: function(combo, newValue, oldValue) {
        var grid = this.query('customgrid')[0];
        
        var module_id = -1;
        
        if (newValue === null) {
            module_id = 0;
        } else {
            module_id = combo.getStore().find('module_id', newValue);
            if (module_id != -1) {
                module_id = newValue;
            }
        }

        if (module_id != -1) {
            grid.getStore().addExtraParams({
                module_id: module_id
            });
            grid.reloadFirstPage();
        }
    }
});