Ext.define('NP.view.viewport.Home', {
	extend: 'Ext.panel.Panel',
    alias: 'widget.viewport.home',
    
    requires: ['NP.view.shared.ContextPicker','NP.view.viewport.SummaryStatList'],

    title: 'Home',
    summaryStatText: 'Summary Statistics', 

    itemId: 'homePanel',

    layout: {
    	type: 'vbox',
    	align: 'stretch'
    },

    initComponent: function() {
        this.items = [
            {
                layout: { type: 'hbox', align: 'middle' },
                border: false,
                bodyStyle: 'background-color: #DFE8F6',
                items: [
                    { flex: 1, border: false, padding: '0 0 0 8', bodyStyle: 'background-color: #DFE8F6', html: '<b>' + this.summaryStatText + '</b>' },
                    { xtype: 'shared.contextpicker', itemId: 'homeContextPicker' }
                ]
            },
            { xtype: 'viewport.summarystatlist', padding: 8 },
            { xtype: 'container', flex: 1, itemId: 'summaryStatDetailPanel', border: false, padding: 8, layout: 'fit' }
        ];

        this.callParent(arguments);
    }
});