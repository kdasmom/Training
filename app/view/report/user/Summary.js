/**
 * Created by Andrey Baranov on 10.04.2014.
 */
Ext.define('NP.view.report.user.Summary', {
    extend: 'NP.view.report.user.AbstractUserReport',

    setupForm: function() {
        var me = this;

    },

    validateForm: function() {
        return this.getForm().isValid();
    },

    getOptions: function() {
        var me         = this;

        return {
            propertyContext  : me.getPropertyContext()
        }
    },

    getExtraParams: function() {
        var me         = this;

        return {
            role_id: me.getForm().findField('group_id').getValue(),
            status: me.getForm().findField('user_status').getValue()
        };
    }
});