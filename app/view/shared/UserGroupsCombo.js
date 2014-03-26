/**
 * Created by rnixx on 26.03.2014.
 */

Ext.define('NP.view.shared.UserGroupsCombo', {
    extend: 'NP.lib.ui.AutoComplete',
    alias: 'widget.shared.usergroupscombo',

    fieldLabel: 'User Group',

    name                : 'usergroup',
    displayField        : 'role_name',
    valueField          : 'role_id',
    queryParam          : 'keyword',
    width               : 400,
    queryMode           : 'local',
    tpl                 : '<tpl for=".">' +
                                '<li class="x-boundlist-item" role="option">{indent_text}{role_name}</li>' +
                            '</tpl>',
    initComponent: function() {
        if (!this.store) {
            this.store = 'user.RoleTree';
        }

        this.callParent(arguments);
    }
});