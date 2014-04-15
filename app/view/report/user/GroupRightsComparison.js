/**
 * Created by Andrey Baranov on 11.04.2014.
 */
Ext.define('NP.view.report.user.GroupRightsComparison', {
    extend: 'NP.view.report.user.AbstractUserReport',

    setupForm: function() {
        var me = this;


        me.getForm().findField('exclude_empty').hide();
        me.getForm().findField('group_id').hide();
        me.getForm().findField('user_status').hide();
        me.getForm().findField('compared_groups').show();
        Ext.ComponentQuery.query('#property_picker_group')[0].hide();
    },

    validateForm: function() {
        return this.getForm().isValid();
    },

    getOptions: function() {
        var me         = this;

        return {}
    },

    getExtraParams: function() {
        var me         = this;

        return {
			compared_groups: me.getForm().findField('compared_groups').getValue()
        };
    }
});