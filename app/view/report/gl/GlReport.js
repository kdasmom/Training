/**
 * Created by Andrey Baranov on 07.04.2014.
 */

Ext.define('NP.view.report.gl.GlReport', {
    extend: 'NP.view.report.AbstractReport',

    getForm: function() {
        return Ext.ComponentQuery.query('[xtype="report.gl.form"]')[0].getForm();
    },

    setupForm: function() {
        var me = this;

        return me.getForm().isValid();
    },

    validateForm: function() {
        var me = this;

        return true;
    },

    getOptions: function() {
        return {};
    },

    getExtraParams: function() {
        var me         = this,
            form       = me.getForm();

        return {
            integration_package_id  : form.findField('integration_package_id').getValue(),
            glaccounttype_id        : form.findField('glaccounttype_id').getValue(),
            glaccount_category      : form.findField('glaccount_category').getValue(),
            glaccount_order         : form.findField('glaccount_order').getValue(),
            glaccount_status        : form.findField('glaccount_status').getValue()
        };
    }
});