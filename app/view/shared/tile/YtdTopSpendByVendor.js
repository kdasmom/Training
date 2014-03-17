/**
 * A pie chart that shows vendors with most spending for the ytd
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.YtdTopSpendByVendor', {
    extend: 'NP.view.shared.tile.AbstractTile',

    requires: [
        'Ext.chart.Chart',
        'Ext.chart.series.Pie',
        'NP.lib.core.Util',
        'NP.lib.data.Store',
        'NP.lib.print.Manager',
        'NP.view.shared.button.Print'
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
                    { vendor_id: 1, vendor_id_alt: 'vendorA', vendor_name: 'Vendor A', total_amount: 1573.22 },
                    { vendor_id: 2, vendor_id_alt: 'vendorB', vendor_name: 'Vendor B', total_amount: 1200.00 },
                    { vendor_id: 3, vendor_id_alt: 'vendorC', vendor_name: 'Vendor C', total_amount: 565.00 },
                    { vendor_id: 4, vendor_id_alt: 'vendorD', vendor_name: 'Vendor D', total_amount: 445.00 },
                    { vendor_id: 5, vendor_id_alt: 'vendorE', vendor_name: 'Vendor E', total_amount: 421.08 }
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
                fields  : me.getStoreFields(),
                service : 'VendorService',
                action  : 'getTopVendors',
                autoLoad: true
            })
        );
    },

    getChart: function(store) {
        var total = 0;
        store.on('load', function() {
            //calculate percentage.
            store.each(function(rec) {
                total += rec.get('total_amount');
            });
        });

        return {
            xtype : 'panel',
            layout: 'fit',
            tbar  : [{
                xtype  : 'shared.button.print',
                text   : null,
                handler: function() {
                    var me    = this,
                        chart = me.up('panel').down('chart');
                    
                    NP.PrintManager.print(chart);
                }
            }],
            items: [{
                xtype  : 'chart',
                animate: true,
                store  : store,
                shadow : true,
                /*legend : {
                    position: 'right'
                },*/
                insetPadding: 30,
                theme       : 'Base:gradients',
                series      : [{
                    type        : 'pie',
                    angleField  : 'total_amount',
                    //showInLegend: true,
                    tips        : {
                        trackMouse: true,
                        width     : 250,
                        height    : 36,
                        renderer  : function(rec, item) {
                            this.setTitle(rec.get('vendor_name') + '<br />' +
                                NP.Util.currencyRenderer(rec.get('total_amount')) + ' (' +
                                Math.round(rec.get('total_amount') / total * 100) + '%)');
                        }
                    },
                    highlight: {
                      segment: {
                        margin: 20
                      }
                    },
                    label: {
                        field   : 'vendor_name',
                        display : 'rotate',
                        contrast: true,
                        font    : '12px Arial',
                        renderer: function(val) {
                            if (val.length > 20) {
                                return val.substr(0, 17) + '...';
                            }
                            
                            return val;
                        }
                    }
                }]
            }]
        };
    },

    getStoreFields: function() {
        return [
            { name: 'vendor_id', type: 'int' },
            { name: 'vendor_id_alt' },
            { name: 'vendor_name' },
            { name: 'total_amount', type: 'float' }
        ];
    }
});