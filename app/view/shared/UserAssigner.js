/**
 * Generic component to assign users
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.UserAssigner', {
    extend: 'Ext.ux.form.ItemSelector',
    alias: 'widget.shared.userassigner',
    
    requires: ['NP.store.user.Userprofiles'],

    fieldLabel: 'Users',

    name        : 'users',
    tpl         : '<tpl for="."><div class="x-boundlist-item">{person_lastname}, {person_firstname} ({userprofile_username})</div></tpl>',
    displayField: 'userprofile_id',
    valueField  : 'userprofile_id',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    buttons     : ['add','remove'],
    msgTarget   : 'under',
	autoLoad    : true,

	initComponent: function() {
		var me = this;

		if (!this.store) {
			this.store = {
				type              : 'user.userprofiles',
				service           : 'UserService',
				action            : 'getAll',
				userprofile_status: 'active',
				autoLoad          : me.autoLoad
			};
		}

		this.callParent(arguments);
	}
});