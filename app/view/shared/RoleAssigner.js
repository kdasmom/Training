/**
 * Generic component to assign users
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.RoleAssigner', {
    extend: 'Ext.ux.form.ItemSelector',
    alias: 'widget.shared.roleassigner',
    
    fieldLabel: 'User Groups',

    name        : 'roles',
    store       : Ext.create('NP.store.user.Roles', {
					service           : 'UserService',
					action            : 'getRoles',
					autoLoad          : true
			    }),
    displayField: 'role_name',
    valueField  : 'role_id',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    buttons     : ['add','remove'],
    msgTarget   : 'under'
});