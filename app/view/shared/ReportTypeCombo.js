/**
 * Created by Andrey Baranov on 10.04.2014.
 */
Ext.define('NP.view.shared.ReportTypeCombo', {
    extend: 'NP.lib.ui.ComboBox',
    alias: 'widget.shared.reporttypecombo',

    requires: ['NP.lib.core.Config'],

    fieldLabel: 'Report Type',

    itemId           : 'report_type',
    name             : 'report_type',
    displayField     : 'report_display_name',
    valueField       : 'report_name',
    width            : 520,
    selectFirstRecord: true,

    initComponent: function() {
        var me = this;

        me.fieldLabel = NP.Translator.translate(me.fieldLabel);

        if (!me.store) {
            me.store = {}
        }

        this.callParent(arguments);
    }
});