/**
 * Created by rnixx on 26.03.2014.
 */


Ext.define('NP.view.shared.UserCombo', {
    extend: 'NP.lib.ui.AutoComplete',
    alias: 'widget.shared.usercombo',

    requires: ['NP.model.user.Userprofile'],

    fieldLabel: 'GL Account',

    name                : 'userprofile_id',
    displayField        : 'userprofile_username',
    valueField          : 'userprofile_id',
    queryParam          : 'keyword',
    width               : 400,
    tpl                 : '<tpl for=".">' +
                                '<li class="x-boundlist-item" role="option">{person_lastname}, {person_firstname} ({userprofile_username})</li>' +
                            '</tpl>',
    initComponent: function() {
        if (!this.store) {
            this.store = Ext.create('NP.store.user.Userprofiles', {
                service : 'UserService',
                action  : 'getAll',
                userprofile_status: 'active'
            });
        }

        this.callParent(arguments);
    }
});