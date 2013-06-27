/**
 * User Manager > Users tab
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.Users', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.user.users',

    requires: [
    	'NP.lib.core.Config',
    	'NP.lib.ui.Grid',
    	'NP.view.shared.button.New',
    	'NP.view.shared.button.Inactivate',
    	'NP.view.shared.button.Activate'
    ],
    
    // For localization
	title                : 'Users',
	createNewUserBtnLabel: 'Create New User',

    layout: 'fit',
    border: false,

    initComponent: function() {
    	var that = this;

    	var bar = [
    		{ xtype: 'shared.button.new', text: this.createNewUserBtnLabel }
	    ];
	    this.tbar = bar;
	    this.bbar = bar;

        this.items = [{
            xtype   : 'customgrid',
            paging  : true,
            selModel: Ext.create('Ext.selection.CheckboxModel'),
            stateful: true,
            stateId : 'user_manager_user_grid',
            store   : Ext.create('NP.store.user.Userprofiles', {
                service: 'UserService',
                action : 'getAll',
                paging : true,
                autoLoad: true
            }),
            columns : [
                {
                	text: 'Name',
                	dataIndex: 'person_lastname',
                	flex: 1,
                	renderer: function(val, meta, rec) {
                		var person = rec.getUserprofilerole().getStaff().getPerson();
                		return person.get('person_lastname') + ', ' + person.get('person_firstname');
                	}
                },{
                	text: 'Group',
                	dataIndex: 'role_name',
                	flex: 1,
                	renderer: function(val, meta, rec) {
                		return rec.getUserprofilerole().getRole().get('role_name');
                	}
                },{
                	text: 'Username',
                	dataIndex: 'userprofile_username',
                	flex: 0.5
                },{
                	text: 'Last Updated',
                	dataIndex: 'userprofile_updated_datetm',
                	flex: 1,
                	renderer: function(val, meta, rec) {
                		val = Ext.Date.format(val, NP.Config.getDefaultDateFormat() + ' h:iA');
                		if (rec.get('userprofile_updated_by') !== null) {
                			val += ' (' + rec.getUpdater().get('userprofile_username') + ')'
                		}
                		return val;
                	}
                },{
                	text: 'Status',
                	dataIndex: 'userprofile_status',
                	flex: 0.5
                }
            ]
        }];

    	this.callParent(arguments);
    }
});