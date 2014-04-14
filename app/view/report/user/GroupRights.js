/**
 * Created by Andrey Baranov on 11.04.2014.
 */
Ext.define('NP.view.report.user.GroupRights', {
    extend: 'NP.view.report.user.AbstractUserReport',

    setupForm: function() {
        var me = this;

        me.getForm().findField('exclude_empty').show();
        me.getForm().findField('group_id').show();
        me.getForm().findField('user_status').hide();
        me.getForm().findField('compared_groups').hide();
        Ext.ComponentQuery.query('#property_picker_group')[0].show();

    },

    validateForm: function() {
        return this.getForm().isValid();
    },

    getOptions: function() {
        var me         = this;

        return {
            propertyContext : me.getPropertyContext(),
        }
    },

    getExtraParams: function() {
        var me         = this;

        return {
            role_id: me.getForm().findField('group_id').getValue(),
            status: me.getForm().findField('user_status').getValue(),
            userRoleId          : NP.Security.getUser().get('role_id')
        };
    }
});