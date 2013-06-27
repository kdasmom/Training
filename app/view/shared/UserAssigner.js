/**
 * Generic component to assign users
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.UserAssigner', {
    extend: 'Ext.ux.form.ItemSelector',
    alias: 'widget.shared.userassigner',
    
    fieldLabel: 'Users',

    name        : 'users',
    store       : Ext.create('NP.store.user.Userprofiles', {
					service           : 'UserService',
					action            : 'getAll',
					userprofile_status: 'active',
					autoLoad          : true
			    }),
    tpl         : '<tpl for="."><div class="x-boundlist-item">{userprofilerole.staff.person.person_lastname}, {userprofilerole.staff.person.person_firstname} ({userprofile_username})</div></tpl>',
    displayField: 'userprofile_id',
    valueField  : 'userprofile_id',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    buttons     : ['add','remove'],
    msgTarget   : 'under'
});