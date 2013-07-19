/**
 * User Manager > Groups tab > Form > Info Tab
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.GroupsFormInfo', {
    extend: 'Ext.container.Container',
    alias: 'widget.user.groupsforminfo',
    
    requires: [
    	'NP.lib.ui.ComboBox'
    ],

    // For locatization
	title              : 'Group Information',
	roleNameFieldLabel : 'Group Name',
	nextLevelFieldLabel: 'Next Level',

    padding: 8,

    initComponent: function() {
    	this.items = [
    		{
				xtype     : 'textfield',
				name      : 'role_name',
				fieldLabel: this.roleNameFieldLabel,
				allowBlank: false
    		},{
				xtype     : 'customcombo',
				name      : 'parent_role_id',
				fieldLabel: this.nextLevelFieldLabel,
				allowBlank: false,
				store     : 'user.RoleTree',
				width     : 500,
				valueField: 'role_id',
				displayField: 'role_name',
				tpl         : 
                    '<tpl for=".">' +
                        '<li class="x-boundlist-item">' +
                        	'{indent_text}{role_name}' +
                        '</li>' +
                    '</tpl>'
    		}
    	];

    	this.callParent(arguments);
    }
});