/**
 * A bar chart that shows MTD spent for a GL category
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.GlCategoryMtdSpend', {
    extend: 'NP.view.shared.tile.AbstractTile',

    requires: [
        'Ext.chart.Chart',
        'NP.lib.core.Translator',
        'NP.lib.core.Util',
        'NP.lib.core.Security',
        'NP.lib.data.Store',
        'NP.lib.ui.ComboBox'
    ],

    /**
     * @return {Object|Ext.Component} A component to be diplayed in the My Settings > Dashboard section to preview the dashboard config; can be a fully initialized component or a definition object with an xtype.
     */
    getPreview: function() {
        var me = this;

        return me.getChart(
            Ext.create('NP.lib.data.Store', {
                fields: me.getStoreFields(),
                data  : [
                    { glaccount_name: 'Category A', budget_amount: 1573.22, actual: 370.50 },
                    { glaccount_name: 'Category B', budget_amount: 1200.00, actual: 427.99 },
                    { glaccount_name: 'Category C', budget_amount: 565.00, actual: 811.40 },
                    { glaccount_name: 'Category D', budget_amount: 445.00, actual: 33.31 },
                    { glaccount_name: 'Category E', budget_amount: 421.08, actual: 175.93 },
                    { glaccount_name: 'Category A', budget_amount: 1573.22, actual: 370.50 },
                    { glaccount_name: 'Category B', budget_amount: 1200.00, actual: 427.99 },
                    { glaccount_name: 'Category C', budget_amount: 565.00, actual: 811.40 },
                    { glaccount_name: 'Category D', budget_amount: 445.00, actual: 33.31 },
                    { glaccount_name: 'Category E', budget_amount: 421.08, actual: 175.93 }
                ]
            })
        );
    },
    
    /**
     * @return {Object|Ext.Component} A component to display on the dashboard; can be a fully initialized component or a definition object with an xtype.
     */
    getDashboardPanel: function() {
        var me = this;

        return me.getChart(
            Ext.create('NP.lib.data.Store', {
                fields     : me.getStoreFields(),
                service    : 'GLService',
                action     : 'getCategoryMtdSpend',
                extraParams: {
                    property_id: NP.Security.getCurrentContext().property_id
                },
                autoLoad   : true
            })
        );
    },

    getChart: function(store) {
        return {
            xtype : 'panel',
            layout: 'fit',
            tbar  : [{
                xtype       : 'customcombo',
                margin      : '0 0 0 8',
                fieldLabel  : NP.Config.getPropertyLabel(),
                labelWidth  : 50,
                width       : 350,
                name        : 'property_id',
                displayField: 'property_name',
                valueField  : 'property_id',
                value       : NP.Security.getCurrentContext().property_id,
                allowBlank  : false,
                store       : 'user.Properties',
                listeners   : {
                    select: function(combo, recs) {
                        var store = combo.up('panel').down('chart').getStore();
                        store.addExtraParams({ property_id: recs[0].get('property_id') });
                        store.load();
                    }
                }
            }],
            items: [{
                xtype  : 'chart',
                animate: true,
                store  : store,
                shadow : true,
                legend : {
                    position: 'top'
                },
                axes: [
                    {
                        title   : NP.Translator.translate('Budget and Actual'),
                        type    : 'Numeric',
                        position: 'bottom',
                        fields  : ['budget_amount','actual'],
                        grid    : true,
                        label   : {
                            renderer: NP.Util.currencyRenderer
                        }
                    },{
                        title   : NP.Translator.translate('GL Category'),
                        type    : 'Category',
                        position: 'left',
                        fields  : ['glaccount_name']
                    }
                ],
                series      : [{
                    type  : 'bar',
                    axis  : 'bottom',
                    xField: 'glaccount_name',
                    yField: ['budget_amount','actual'],
                    title : ['Budget','Actual'],
                    label: {
                        display      : 'outside',
                        field        : ['budget_amount','actual'],
                        renderer     : function(val, sprite, rec) {
                            if (rec.get('actual') > rec.get('budget_amount')) {
                                sprite.setAttributes({
                                    stroke: '#FF0000',
                                    'stroke-width': 0.5
                                });
                            }

                            return NP.Util.currencyRenderer(val);
                        }
                    }
                }]
            }]
        };
    },

    getStoreFields: function() {
        return [
            { name: 'glaccount_name' },
            { name: 'budget_amount', type: 'float' },
            { name: 'actual', type: 'float' }
        ];
    }
});