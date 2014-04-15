/**
 * Generic component to assign users
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.UserAssigner', {
    extend: 'NP.lib.ui.Assigner',
    alias: 'widget.shared.userassigner',
    
    requires: ['NP.store.user.Userprofiles'],

    fieldLabel: 'Users',

    name        : 'users',
    tpl         : '<tpl for="."><div class="x-boundlist-item">{person_lastname}, {person_firstname} ({userprofile_username})</div></tpl>',
    displayField: 'person_lastname',
    valueField  : 'userprofile_id',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    buttons     : ['add','remove'],
    msgTarget   : 'under',

	initComponent: function() {
		var me = this;

		if (!this.store) {
			this.store = {
				type              : 'user.userprofiles',
				service           : 'UserService',
				action            : 'getAll',
				autoLoad          : true,
				extraParams: {
                    userprofile_status: 'active'
                },
                sorters: [{
                    property : 'person_lastname',
                    direction: 'ASC'
                }]
			};
		}

		this.callParent(arguments);
	}
});