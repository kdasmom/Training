/**
 * Created by Andrey Baranov on 08.04.2014.
 */


Ext.define('NP.view.report.user.AbstractUserReport', {
    extend: 'NP.view.report.AbstractReport',

    requires: ['NP.lib.core.Security'],

    getForm: function() {
        return Ext.ComponentQuery.query('[xtype="report.user.form"]')[0].getForm();
    },
    getPropertyPicker: function() {
        return Ext.ComponentQuery.query('#property_picker')[0];
    },
    getPropertyContext: function() {
        var me              = this,
            propertyContext = me.getPropertyPicker().getState();

        Ext.apply(propertyContext, {
            userprofile_id              : NP.Security.getUser().get('userprofile_id'),
            delegation_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
            selection                   : propertyContext.selected,
            includeCodingOnly           : false
        });

        return propertyContext;
    }
});