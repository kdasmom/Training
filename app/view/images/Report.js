Ext.define('NP.view.images.Report', {
    extend: 'Ext.panel.Panel',
    alias:  'widget.images.report',

    title:  'Report',
    autoscroll: true,

    requires: [
        'NP.view.shared.ContextPickerMulti'
    ],

    locale: {
        buttonSearch: 'Search Images',
        buttonReport: 'Generate Report',
        buttonReturn: 'Return to Image Management'
    },

    initComponent: function() {
        this.items = [
            {
                xtype: 'shared.contextpickermulti',
                fieldLabel: 'Property:'
            }
        ];

        this.tbar = [
            {xtype: 'button', itemId: 'buttonReturn', text: this.locale.buttonReturn},
            {xtype: 'tbspacer', width: 20},
            {xtype: 'button', itemId: 'buttonSearch', text: this.locale.buttonSearch},
            {xtype: 'button', itemId: 'buttonGenerateReport', text: this.locale.buttonReport}
        ];
        this.callParent(arguments);
    }
});