/**
 * Created by Andrey Baranov on 11.04.2014.
 */
Ext.define('NP.view.shared.UserGroupAssigner', {
    extend: 'NP.lib.ui.Assigner',
    alias: 'widget.shared.usergroupassigner',

    requires: ['NP.lib.core.Config'],

    fieldLabel: '',
    name        : 'user_group',
    displayField: 'role_name',
    valueField  : 'role_id',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    msgTarget   : 'under',
    height: 200,

    initComponent: function() {
        if (!this.store) {
            this.store = {};
        }

        this.callParent(arguments);
    }
});