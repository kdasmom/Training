/**
 * The PO forward window
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.ForwardWindow', {
    extend: 'NP.view.shared.invoicepo.AbstractForwardWindow',
    alias: 'widget.po.forwardwindow',

    requires: [
        'NP.lib.core.Translator',
        'NP.lib.core.Security',
        'NP.lib.ui.ComboBox',
        'NP.store.system.PrintTemplates'
    ],

    initComponent: function() {
        var me = this,
            checkGroup;

        me.callParent(arguments);

        // We need to run doLayout() to fix the space that sometimes shows between template picker
        // and checkboxes
        checkGroup = me.down('[name="include_group"]');

        if (checkGroup) {
            me.on('afterrender', function() {
                setTimeout(function() {
                    checkGroup.doLayout();
                }, 150);
            });
        }
    },

    getDisplayName: function() {
        return 'PO';
    },

    getShortName: function() {
        return 'po';
    },

    getLongName: function() {
        return 'purchaseorder';
    },

    getRightColumn: function() {
        var me = this;

        if (Ext.isEmpty(me.entity.get('print_template_id'))) {
            return {
                xtype: 'hiddenfield',
                name : 'print_template_id',
                value: me.entity.get('print_template_id')
            };
        } else {
            var cfg = me.callParent(arguments);

            cfg.items.unshift({
                xtype       : 'customcombo',
                fieldLabel  : NP.Translator.translate('Select which template to use'),
                labelAlign  : 'top',
                name        : 'print_template_id',
                displayField: 'Print_Template_Name',
                valueField  : 'Print_Template_Id',
                store       : {
                    type: 'system.printtemplates'
                }
            });

            return cfg;
        }
    },

    getIncludeOptions: function() {
        var me      = this,
            options = [
                { boxLabel: NP.Translator.translate('Created By'), inputValue: 'created' },
                { boxLabel: NP.Translator.translate('GL Codes'), inputValue: 'glCode' },
                { boxLabel: NP.Translator.translate('Dept/Unit/Building'), inputValue: 'unit' },
                { boxLabel: NP.Translator.translate('Header Custom Fields'), inputValue: 'headerCustom' },
                { boxLabel: NP.Translator.translate('Line Item Custom Fields'), inputValue: 'lineCustom' },
                { boxLabel: NP.Translator.translate('Job Cost Values'), inputValue: 'job' },
                { boxLabel: NP.Translator.translate('History Log'), inputValue: 'history' },
                { boxLabel: NP.Translator.translate('Forward To Log'), inputValue: 'forward' },
                { boxLabel: NP.Translator.translate('Notes'), inputValue: 'notes' },
                { boxLabel: NP.Translator.translate('Budget Overage Notes'), inputValue: 'overageNotes' }
            ];

        options.push(
            { boxLabel: NP.Translator.translate('Include Main Image Only'), inputValue: 'mainImage' },
            { boxLabel: NP.Translator.translate('Include All Images'), inputValue: 'allImages' }
        );

        return options;
    }
});