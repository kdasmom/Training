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

    bodyPadding: 8,
    
    glNumberFieldText : 'GL Number',
    glNameFieldText : 'GL Name',
    categoryFieldText : 'Category',
    statusFieldText : 'Status',
    typesFieldText : 'Types',

    initComponent: function() {
        
        var defaultWidth = 578;
        
        var bar = [
            { xtype: 'shared.button.cancel', itemId: 'glaccountCancelBtn' },
            { xtype: 'shared.button.save', itemId: 'glaccountSaveBtn' }
        ];
        this.tbar = bar;
        this.bbar = bar;
        
         this.items = [
            // GL Number
    		{ xtype: 'textfield', fieldLabel: this.glNumberFieldText, name: 'glaccount_number', width: defaultWidth, allowBlank: false },
            // GL Name
            { xtype: 'textfield', fieldLabel: this.glNameFieldText, name: 'glaccount_name', width: defaultWidth },
            // Category
    		{ xtype: 'textfield', fieldLabel: this.categoryFieldText, name: 'glaccount_level', width: defaultWidth },
            // Status
    		{ xtype: 'textfield', fieldLabel: this.statusFieldText, name: 'glaccount_status', width: defaultWidth, allowBlank: false },
            // Types
    		{ xtype: 'textfield', fieldLabel: this.typesFieldText, name: 'glaccount_types', allowBlank: false },
        ];

        this.callParent(arguments);
    }
});