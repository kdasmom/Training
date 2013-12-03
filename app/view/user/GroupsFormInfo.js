/**
 * User Manager > Groups tab > Form > Info Tab
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.GroupsFormInfo', {
    extend: 'Ext.container.Container',
    alias: 'widget.user.groupsforminfo',
    
    requires: [
    	'NP.lib.ui.ComboBox',
        'NP.lib.core.Translator'
    ],

    padding: 8,

    initComponent: function() {
        this.title = NP.Translator.translate('Group Information');

    	this.items = [
    		{
				xtype     : 'textfield',
				name      : 'role_name',
				fieldLabel: NP.Translator.translate('Group Name'),
				allowBlank: false
    		},{
				xtype     : 'customcombo',
				name      : 'parent_role_id',
				fieldLabel: NP.Translator.translate('Next Level'),
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