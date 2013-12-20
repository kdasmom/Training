/**
 * Generic component to assign users
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.RoleAssigner', {
    extend: 'NP.lib.ui.Assigner',
    alias: 'widget.shared.roleassigner',
    
    requires: ['NP.store.user.Roles'],

    fieldLabel: 'User Groups',

    name        : 'roles',
    store       : {
                    type    : 'user.roles',
                    service : 'UserService',
                    action  : 'getRoles',
                    autoLoad: true
			    },
    displayField: 'role_name',
    valueField  : 'role_id',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    msgTarget   : 'under'
});