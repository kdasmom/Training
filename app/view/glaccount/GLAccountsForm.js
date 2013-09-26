/**
 * GL Account Setup > GLAccounts section > Form
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.glaccount.GLAccountsForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.glaccount.glaccountsform',
    
    requires: [
    	'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save',
    ],

    autoScroll: true,

    layout: 'fit',

    initComponent: function() {
        var bar = [
            { xtype: 'shared.button.cancel', itemId: 'glaccountCancelBtn' },
            { xtype: 'shared.button.save', itemId: 'glaccountSaveBtn' }
        ];
        this.tbar = bar;
        this.bbar = bar;

        this.callParent(arguments);
    }
});