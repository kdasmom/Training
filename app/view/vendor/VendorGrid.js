/**
 * A component to easily create a Vendor Grid
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.vendor.VendorGrid', {
	extend: 'NP.lib.ui.Grid',
 	alias : 'widget.vendor.vendorgrid',

    requires: [
    	'NP.lib.core.Config',
    	'NP.view.vendor.gridcol.SentForApprovalDate',
    	'NP.view.vendor.gridcol.VendorName',
    	'NP.view.vendor.gridcol.SentForApprovalBy',
		'NP.view.vendor.gridcol.ApprovalType',
		'NP.view.shared.gridcol.IntegrationPackageName'
    ],
    
    // This is the default list of columns available for Invoice grids
	colOptions: ['vendor.gridcol.SentForApprovalDate','vendor.gridcol.VendorName','vendor.gridcol.SentForApprovalBy',
				'vendor.gridcol.ApprovalType','shared.gridcol.IntegrationPackageName'],

    /**
     * @cfg {Array} cols         Columns that you want to display on the grid by default
     */
    /**
     * @cfg {Array} excludedCols Columns that you want to exclude from the column options the user can select from
     */
	initComponent: function() {
		// Track our final list of columns definitions
		var colDefs = [];

		// If excludedCols wasn't defined, make it a blank array
		if (!this.excludedCols) {
			this.excludedCols = [];
		}

		// Loop through the columns specified by the user and add them to the grid as visible columns
		for (var i=0; i<this.cols.length; i++) {
			colDefs.push({ xtype: this.cols[i].toLowerCase(), flex: 1 });
		}

		// Look though the default list of columns
		for (var i=0; i<this.colOptions.length; i++) {
			// Lower case the options because they are camel cased for the requires, but need to be lower cased
			var col = this.colOptions[i];
			// If the column hasn't already been included and it's not in the excluded list, add it as a hidden column
			if (this.cols.indexOf(col) === -1 && this.excludedCols.indexOf(col) === -1) {
				colDefs.push({ xtype: col.toLowerCase(), flex: 1, hidden: true });
			}
		}

		// Add the final definitions to the grid's columns config option
		this.columns = {
		    items: colDefs
		};
    	
    	this.callParent(arguments);
    }
});