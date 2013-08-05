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
          
        var bar = [
                    { xtype: 'shared.button.cancel', text: 'Cancel' },
                    { xtype: 'shared.button.inactivate', text: 'Decline' },
                    { xtype: 'shared.button.activate', text: 'Accept' },
 	    		
	    ];
        this.tbar = bar;
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