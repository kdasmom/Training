/**
 * The AbstractInvoiceGrid class can be extended to easily create an invoice grid. All that's required
 * are a few configuration options.
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.grid.AbstractInvoiceGrid', {
    extend: 'NP.lib.ui.Grid',
    
    requires: ['NP.lib.core.Util','NP.lib.core.Config'],
    
    /**
     * @cfg {Array} cols         Columns that you want to display on the grid by default
     */
    /**
     * @cfg {Array} excludedCols Columns that you want to exclude from the column options the user can select from
     */
	initComponent: function() {
		// This is the default list of columns available for Invoice grids
		var colOptions = ['PropertyName','VendorName','InvoiceDate','InvoiceCreatedDate','InvoicePeriod','InvoiceDueDate',
							'InvoiceNeededByDate','InvoiceNumber','InvoiceAmount','InvoicePendingDays','InvoiceStatus','PriorityFlag'];
		// Track our final list of columns definitions
		var colDefs = [];

		// If excludedCols wasn't defined, make it a blank array
		if (!this.excludedCols) {
			this.excludedCols = [];
		}

		// Loop through the columns specified by the user and add them to the grid as visible columns
		for (var i=0; i<this.cols.length; i++) {
			colDefs.push(Ext.create('NP.view.shared.gridcol.'+this.cols[i], { flex: 1 }));
		}

		// Look though the default list of columns
		for (var i=0; i<colOptions.length; i++) {
			// If the column hasn't already been included and it's not in the excluded list, add it as a hidden column
			if (this.cols.indexOf(colOptions[i]) === -1 && this.excludedCols.indexOf(colOptions[i]) === -1) {
				colDefs.push(Ext.create('NP.view.shared.gridcol.'+colOptions[i], { flex: 1, hidden: true }));
			}
		}

		// Add the final definitions to the grid's columns config option
		this.columns = {
		    items: colDefs
		};
    	
    	this.callParent(arguments);
    }
});