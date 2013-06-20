/**
 * Vertical tab in Property Setup > Properties > Add/Edit form 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.PropertiesFormUsers', {
    extend: 'Ext.ux.form.ItemSelector',
    alias: 'widget.property.propertiesformusers',
    
    title: 'User Assignment',

    autoScroll: true,

    margin: 8,

    name        : 'property_users',
    anchor      : '100%',
    store       : Ext.create('NP.store.user.Userprofiles', {
					service           : 'UserService',
					action            : 'getAll',
					userprofile_status: 'active',
					autoLoad          : true
			    }),
    tpl         : '<tpl for="."><div class="x-boundlist-item">{person_lastname}, {person_firstname} ({userprofile_username})</div></tpl>',
    displayField: 'userprofile_id',
    valueField  : 'userprofile_id',
    fromTitle   : 'Unassigned Users',
    toTitle     : 'Assigned Users',
    buttons     : ['add','remove'],
    msgTarget   : 'under'
});