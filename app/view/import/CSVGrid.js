/**
 * CSV grid
 *
 * @author Zubik Aliaksandr
 */
Ext.define('NP.view.import.CSVGrid', {
    extend: 'NP.lib.ui.Grid',
    alias : 'widget.import.csvgrid',
       
    requires: [
    	'NP.lib.core.Config',
        'NP.view.shared.button.save',
        'NP.view.shared.button.cancel',
    	'NP.view.shared.button.Inactivate',
    	'NP.view.shared.button.Activate',
        'NP.lib.ui.ComboBox',
        'NP.view.shared.PropertyCombo'
    ],
    paging  : true,
    stateful: true,
    stateId : 'csv_grid',

    title: 'CSV GL Accounts Preview',

    initComponent: function() {     
        // Add the base columns for the grid
        this.columns = [
            { text: 'GLAccount Name', dataIndex: 'exim_glaccountName' },
            { text: 'Account Number', dataIndex: 'exim_glaccountNumber' },
            { text: 'Account Type', dataIndex: 'exim_accountType' },
            { text: 'Category Name', dataIndex: 'exim_categoryName'},
            { text: 'Integration Package Name', dataIndex: 'exim_integrationPackage'},
            { text: 'Status', dataIndex: 'exim_status' }
        ];
        
        this.pagingToolbarButtons = [
                    { xtype: 'shared.button.activate', disabled: true },
                    { xtype: 'shared.button.inactivate', disabled: true }
                ];
        
        this.selModel = Ext.create('Ext.selection.CheckboxModel');
        
        var bar = [
 	    		{ xtype: 'shared.button.save', text: 'Save' },
 	    		{ xtype: 'shared.button.cancel', text: 'Cancel' }
	    ];
        this.tbar = bar;
        this.bbar = bar;
        // Create the store
        this.store = Ext.create('NP.store.gl.GlImportAccounts', {
            service    : 'GLService',
            action     : 'getCSVFile',
            paging     : true,
            extraParams: { file: this.file } 
        });

        this.callParent(arguments);
    }
});