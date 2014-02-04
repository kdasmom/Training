/**
 * 
 */
Ext.define('NP.lib.print.renderer.Chart', {
    extend: 'NP.lib.print.renderer.AbstractRenderer',

    styleSheets: ['ext/packages/ext-theme-classic/build/resources/ext-theme-classic-all-debug.css'],

    // For charts, we'll just override the whole print function because it's completely different
    print: function(chart) {
        var me         = this,
            printChart = Ext.widget('panel', {
                layout: 'fit',
                width   : 800,
                height  : 600,
                style: {
                    position: 'absolute',
                    left    : '-999em'
                },
                items : [Ext.apply(chart.initialConfig, { animate: false })]
            });

        printChart.on('render', function() {
            function showPrintableChart() {
                if (!printChart.getEl().down('rect')) {
                    setTimeout(function() {
                        showPrintableChart();
                    }, 100);

                    return;
                }

                // Because we're making a copy of the chart to display, get the title from the
                // real chart object and set it on the renderer config
                if (!me.title) {
                    me.title = me.getTitle(chart);
                }

                var html = me.generateHTML(printChart.down('chart'));

                printChart.destroy();

                me.showPrintWindow(html);

            }
            showPrintableChart();
        });

        printChart.render(Ext.getBody());
    },

    generateBody: function(chart) {
        return chart.getEl().getHTML();
    }
});