/**
 * CSV grid
 *
 * @author Zubik Aliaksandr
 */
Ext.define('NP.view.import.CSVGrid', {
    extend: 'NP.lib.ui.Grid',
    alias : 'widget.messagecenter.csvgrid',
    
    paging  : true,
    stateful: true,
    stateId : 'csv_grid',

    title: 'CSV Grid',

    initComponent: function() {     
        // Add the base columns for the grid
        this.columns = [
            { text: 'GLAccount Name', dataIndex: 'glaccount_name' },
            { text: 'Account Number', dataIndex: 'glaccount_number' },
            { text: 'Account Type', dataIndex: 'glaccounttype_id' },
            { text: 'Category Name', dataIndex: 'integration_package_id'},
            { text: 'Integration Package Name', dataIndex: 'integration_package_id'},
        ];
        // Create the store, only thing that changes between stores is the vc_status
        this.store = Ext.create('NP.store.gl.GlAccounts', {
            service    : 'GLService',
            action     : 'getCSVFile',
            paging     : true,
            extraParams: { file: 'glcategory.csv' } 
        });

        this.callParent(arguments);
    }
});