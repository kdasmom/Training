/**
 * The invoice/PO history detail window
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.BudgetDetailWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.shared.invoicepo.budgetdetailwindow',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator',
    	'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Search',
        'NP.model.gl.GlAccount',
        'NP.lib.ui.Grid'
    ],

    layout     : 'fit',
    width      : 600,
    height     : 250,
    modal      : true,
    minimizable: false,

    showYearly: false,

    initComponent: function() {
    	var me = this,
            cols;

        me.title = NP.Translator.translate('Budget Details');

        cols = [
            {
                dataIndex: 'name',
                flex     : 4
            },{
                dataIndex: 'month',
                flex     : 1,
                align    : 'right',
                renderer : NP.Util.currencyRenderer
            }
        ];

        if (me.showYearly) {
            cols.push({
                dataIndex: 'year',
                flex     : 1,
                align    : 'right',
                renderer : NP.Util.currencyRenderer
            });
        }

        me.gridStore = Ext.create('Ext.data.Store', {
            fields: [
                { name: 'name' },
                { name: 'month', type: 'float' },
                { name: 'year', type: 'float' }
            ]
        });

        me.items = [{
            xtype           : 'customgrid',
            sortableColumns : false,
            enableColumnHide: false,
            enableColumnMove: false,
            border          : false,
            tbar            : [
                { xtype: 'shared.button.cancel', handler: function() { me.close(); } },
                { xtype: 'shared.button.search', text: '', type: 'account' }
            ],
            store  : me.gridStore,
            columns: cols
        }];


    	me.callParent(arguments);

        me.grid = me.down('customgrid');
    },

    updateContent: function(data) {
        var me           = this,
            btnText      = (data.gl_label == 'Code') ? 'Category' : 'Code',
            storeData    = [],
            totalYear    = 0,
            yearVariance = 0,
            cols         = me.grid.columnManager.getColumns();

        me.down('[xtype="shared.button.search"]').setText(NP.Translator.translate('View By ' + btnText));
        //me.down('#budgetDetailPanel').update(me.xTemplate.apply(data));

        cols[0].setText(data['property_name'] + ' - ' + data['gl_label'] + ': ' + data['glaccount_name']);
        cols[1].setText(data['month']);
        if (me.showYearly) {
            cols[2].setText(data['year']);
        }

        if (me.showYearly) {
            totalYear    = data['year_actual'] + data['year_po'] + data['year_invoice'];
            yearVariance = data['year_budget'] - (data['year_actual'] + data['year_po'] + data['year_invoice']);
        }

        storeData.push(
            {
                name : data['package_type_name'] + ' ' + NP.Translator.translate('Actual'),
                month: data['month_actual'],
                year : data['year_actual']
            },{
                name : NP.Translator.translate('+ PN Open POs'),
                month: data['month_po'],
                year : data['year_po']
            },{
                name : NP.Translator.translate('+ PN Open Invoices'),
                month: data['month_invoice'],
                year : data['year_invoice']
            },{
                name : NP.Translator.translate('= Forecast Total'),
                month: data['month_actual'] + data['month_po'] + data['month_invoice'],
                year : totalYear
            },{
                name : NP.Translator.translate('Budget'),
                month: data['month_budget'],
                year : data['year_budget']
            },{
                name : NP.Translator.translate('Variance'),
                month: data['month_budget'] - (data['month_actual'] + data['month_po'] + data['month_invoice']),
                year : yearVariance
            }
        );

        me.gridStore.loadRawData(storeData);
    }
});