/**
 * Created by Andrey Baranov on 08.04.2014.
 */


Ext.define('NP.view.report.user.AbstractUserReport', {
    extend: 'NP.view.report.AbstractReport',

    requires: ['NP.lib.core.Security'],

    getForm: function() {
        return Ext.ComponentQuery.query('[xtype="report.user.form"]')[0].getForm();
    }
});