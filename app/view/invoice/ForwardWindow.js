/**
 * The invoice forward window
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.ForwardWindow', {
    extend: 'NP.view.shared.invoicepo.AbstractForwardWindow',
    alias: 'widget.invoice.forwardwindow',

    requires: [
        'NP.lib.core.Translator',
        'NP.lib.core.Security'
    ],

    getDisplayName: function() {
        return 'Invoice';
    },

    getShortName: function() {
        return 'invoice';
    },

    getLongName: function() {
        return 'invoice';
    },

    getIncludeOptions: function() {
        var me      = this,
            options = [
                { boxLabel: NP.Translator.translate('Payment History'), inputValue: 'payments' },
                { boxLabel: NP.Translator.translate('History Log'), inputValue: 'history' },
                { boxLabel: NP.Translator.translate('Notes'), inputValue: 'notes' },
                { boxLabel: NP.Translator.translate('Budget Overage Notes'), inputValue: 'overageNotes' }
            ];

        if (NP.Security.hasPermission(6001)) {
            options.push({ boxLabel: NP.Translator.translate('On Hold Reason'), inputValue: 'holdReason' });
        }

        options.push(
            { boxLabel: NP.Translator.translate('Include Main Image Only'), inputValue: 'mainImage' },
            { boxLabel: NP.Translator.translate('Include All Images'), inputValue: 'allImages' },
            { boxLabel: NP.Translator.translate('Header Custom Fields'), inputValue: 'headerCustom' },
            { boxLabel: NP.Translator.translate('Line Item Custom Fields'), inputValue: 'lineCustom' }
        );

        return options;
    }
});