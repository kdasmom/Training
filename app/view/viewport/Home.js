/**
 * The home page, which shows dashboard summary stats.
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.Home', {
	extend: 'Ext.panel.Panel',
    alias: 'widget.viewport.home',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator',
        'NP.view.shared.ContextPicker',
        'NP.view.viewport.SummaryStatList',
        'NP.view.viewport.SummaryDetailPanel'
    ],

    layout: {
    	type: 'vbox',
    	align: 'stretch'
    },

    initComponent: function() {
        this.title = NP.Translator.translate('Home');

        this.items = [
            {
                layout: { type: 'hbox', align: 'middle' },
                border: false,
                bodyStyle: 'background-color: #DFE8F6',
                items: [
                    {
                        flex: 1,
                        border: false,
                        padding: '0 0 0 8',
                        bodyStyle: 'background-color: ' + NP.lib.core.Config.getToolbarBg(),
                        html: '<b>' + NP.Translator.translate('Summary Statistics') + '</b>'
                    },
                    { xtype: 'shared.contextpicker', itemId: 'homeContextPicker' }
                ]
            },
            { xtype: 'viewport.summarystatlist', stateful: true, stateId: 'summarystat_list', padding: 8 },
            { xtype: 'viewport.summarydetailpanel', flex: 1 }
        ];

        this.callParent(arguments);
    }
});