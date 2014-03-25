/**
 * Generic component to assign users
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.RoleAssigner', {
    extend: 'Ext.ux.form.ItemSelector',
    alias: 'widget.shared.roleassigner',
    
    requires: ['NP.store.user.Roles'],

    fieldLabel: 'User Groups',

    name        : 'roles',
    displayField: 'role_name',
    valueField  : 'role_id',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    buttons     : ['add','remove'],
    msgTarget   : 'under',
	autoLoad    : true,

	initComponent: function() {
		var me = this;

		if (!this.store) {
			this.store = {
				type     : 'user.roles',
				service  : 'UserService',
				action   : 'getRoles',
				autoLoad : me.autoLoad
			};
		}

		this.callParent(arguments);
	}
});