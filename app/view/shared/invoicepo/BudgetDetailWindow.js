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
        'NP.model.gl.GlAccount'
    ],

    layout     : 'fit',
    width      : 600,
    height     : 250,
    modal      : true,
    minimizable: false,

    showYearly: false,

    initComponent: function() {
    	var me = this;

        me.title = NP.Translator.translate('Budget Details');

        me.tbar = [
            { xtype: 'shared.button.cancel', handler: function() { me.close(); } },
            { xtype: 'shared.button.search', text: '', type: 'account' }
        ];

        me.xTemplate = new Ext.XTemplate(me.buildTpl());

        me.items = [{
            xtype     : 'panel',
            itemId    : 'budgetDetailPanel',
            border    : false,
            autoScroll: true,
            html      : ''
        }];

    	me.callParent(arguments);
    },

    updateContent: function(data) {
        var me      = this,
            btnText = (data.gl_label == 'Code') ? 'Category' : 'Code';

        me.down('[xtype="shared.button.search"]').setText(NP.Translator.translate('View By ' + btnText));
        me.down('#budgetDetailPanel').update(me.xTemplate.apply(data));
    },

    buildTpl: function() {
        var me = this,
            html;

        html = '<table width="100%" id="budgetDetailWin">' +
            '<thead>' +
            '<tr>' +
                '<th>{property_name} - {gl_label}: {glaccount_name}</th>' +
                '<th class="align-right">{month}</th>';

        if (me.showYearly) {
            html += '<th class="align-right">{year}</th>';
        }

        html += '</tr>' +
            '</thead>' +
            '<tbody>' +
            '<tr>' +
                '<td>{package_type_name} Actual</td>' +
                '<td class="align-right">{[NP.Util.currencyRenderer(values.month_actual)]}</td>';

        if (me.showYearly) {
            html += '<td class="align-right">{[NP.Util.currencyRenderer(values.year_actual)]}</td>';
        }

        html += '</tr>' +
            '<tr>' +
                '<td>+ PN Open POs</td>' +
                '<td class="align-right">{[NP.Util.currencyRenderer(values.month_po)]}</td>';

        if (me.showYearly) {
            html += '<td class="align-right">{[NP.Util.currencyRenderer(values.year_po)]}</td>';
        }

        html += '</tr>' +
            '<tr>' +
                '<td>+ PN Open Invoices</td>' +
                '<td class="align-right">{[NP.Util.currencyRenderer(values.month_invoice)]}</td>';

        if (me.showYearly) {
            html += '<td class="align-right">{[NP.Util.currencyRenderer(values.year_invoice)]}</td>';
        }

        html += '</tr>' +
            '<tr>' +
                '<td>= Forecast Total</td>' +
                '<td class="align-right">{[NP.Util.currencyRenderer(values.month_actual + values.month_po + values.month_invoice)]}</td>';

        if (me.showYearly) {
            html += '<td class="align-right">{[NP.Util.currencyRenderer(values.year_actual + values.year_po + values.year_invoice)]}</td>';
        }

        html += '</tr>' +
            '<tr>' +
                '<td>Budget</td>' +
                '<td class="align-right">{[NP.Util.currencyRenderer(values.month_budget)]}</td>';

        if (me.showYearly) {
            html += '<td class="align-right">{[NP.Util.currencyRenderer(values.year_budget)]}</td>';
        }

        html += '</tr>' +
            '<tr>' +
                '<td>Variance</td>' +
                '<td class="align-right">{[NP.Util.currencyRenderer(values.month_budget - (values.month_actual + values.month_po + values.month_invoice))]}</td>';

        if (me.showYearly) {
            html += '<td class="align-right">{[NP.Util.currencyRenderer(values.year_budget - (values.year_actual + values.year_po + values.year_invoice))]}</td>';
        }

        html += '</tr>' +
            '</tbody>' +
            '</table>';

        return html;
    }
});