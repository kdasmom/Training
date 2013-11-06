/**
 * A component to easily create a Receipt Grid
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.receipt.ReceiptGrid', {
	extend: 'NP.lib.ui.Grid',
 	alias : 'widget.receipt.receiptgrid',

    requires: [
    	'NP.lib.core.Config',
    	'NP.view.property.gridcol.PropertyName',
    	'NP.view.property.gridcol.PropertyCode',
    	'NP.view.vendor.gridcol.VendorName',
		'NP.view.vendor.gridcol.VendorCode',
    	'NP.view.receipt.gridcol.CreatedDate',
    	'NP.view.shared.gridcol.CreatedBy',
		'NP.view.receipt.gridcol.Period',
     	'NP.view.receipt.gridcol.Number',
    	'NP.view.shared.gridcol.Amount',
    	'NP.view.receipt.gridcol.ReceiveDate',
		'NP.view.receipt.gridcol.TransferDate',
    	'NP.view.shared.gridcol.PendingDays',
    	'NP.view.shared.gridcol.LastApprovedDate',
		'NP.view.shared.gridcol.LastApprovedBy',
    	'NP.view.shared.gridcol.RejectedBy',
    	'NP.view.shared.gridcol.RejectedDate',
		'NP.view.shared.gridcol.PendingApprovalDays',
    	'NP.view.po.gridcol.Notes'
    ],
    
    // This is the default list of columns available for Invoice grids
	colOptions: ['property.gridcol.PropertyName','property.gridcol.PropertyCode','vendor.gridcol.VendorName',
				'vendor.gridcol.VendorCode','receipt.gridcol.CreatedDate','shared.gridcol.CreatedBy',
				'receipt.gridcol.Period', 'receipt.gridcol.Number','shared.gridcol.Amount','receipt.gridcol.ReceiveDate',
				'receipt.gridcol.TransferDate','shared.gridcol.PendingDays','shared.gridcol.LastApprovedDate',
				'shared.gridcol.LastApprovedBy','shared.gridcol.RejectedBy','shared.gridcol.RejectedDate',
				'shared.gridcol.PendingApprovalDays','po.gridcol.Notes'],

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