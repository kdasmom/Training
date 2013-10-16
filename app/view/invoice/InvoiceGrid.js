/**
 * The InvoiceGrid class can be used to easily create an invoice grid. All that's required
 * are a few configuration options.
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.InvoiceGrid', function() {
	// This is the default list of columns available for Invoice grids
	var colOptions = ['property.gridcol.PropertyName','property.gridcol.PropertyCode','vendor.gridcol.VendorName',
					'vendor.gridcol.VendorCode','invoice.gridcol.Date','invoice.gridcol.CreatedDate',
					'shared.gridcol.CreatedBy','shared.gridcol.RejectedDate','shared.gridcol.RejectedBy',
					'shared.gridcol.RejectedReason','invoice.gridcol.Period','invoice.gridcol.DueDate',
					'invoice.gridcol.NeededByDate','invoice.gridcol.Number','invoice.gridcol.TemplateName','shared.gridcol.Amount',
					'invoice.gridcol.PendingDays','shared.gridcol.PendingApprovalDays','shared.gridcol.PendingApprovalFor',
					'invoice.gridcol.Status','shared.gridcol.PriorityFlag','invoice.gridcol.RemittanceAdvice',
					'invoice.gridcol.Notes','invoice.gridcol.BudgetNotes','shared.gridcol.LastApprovedDate',
					'shared.gridcol.LastApprovedBy','invoice.gridcol.HoldDate','invoice.gridcol.DaysOnHold',
					'invoice.gridcol.OnHoldBy','invoice.gridcol.VoidDate','invoice.gridcol.VoidBy',
					'invoice.gridcol.PaymentDetails','invoice.gridcol.PaymentAmountRemaining'];

	var requires = ['NP.lib.core.Util','NP.lib.core.Config'];
	
	Ext.each(colOptions, function(col) {
		requires.push('NP.view.' + col);
	});
	
	requires.push('NP.view.shared.gridcol.UniversalField');

	return {
	    extend: 'NP.lib.ui.Grid',
	 	alias : 'widget.invoice.invoicegrid',

	    requires: requires,

	    emptyText: 'No invoices found.',
	    
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
			
			// Get custom field header definitions
			var customFields = NP.Config.getCustomFields().header.fields;
			var hasCustomFields = false;

			function addCustomFields(hidden) {
				Ext.Object.each(customFields, function(key, field) {
					if (field.invOn) {
						colDefs.push({ xtype: 'shared.gridcol.universalfield', fieldNumber: key, flex: 1, hidden: hidden });
					}
				});
			}

			// Loop through the columns specified by the user and add them to the grid as visible columns
			for (var i=0; i<this.cols.length; i++) {
				if (this.cols[i] === 'shared.gridcol.UniversalField') {
					addCustomFields(false);
					hasCustomFields = true;
				} else {
					colDefs.push({ xtype: this.cols[i].toLowerCase(), flex: 1 });
				}
			}

			// Look though the default list of columns
			for (var i=0; i<colOptions.length; i++) {
				// Lower case the options because they are camel cased for the requires, but need to be lower cased
				var col = colOptions[i];
				// If the column hasn't already been included and it's not in the excluded list, add it as a hidden column
				if (this.cols.indexOf(col) === -1 && this.excludedCols.indexOf(col) === -1) {
					colDefs.push({ xtype: col.toLowerCase(), flex: 1, hidden: true });
				}
			}

			// Deal with custom fields
			if (!hasCustomFields && this.excludedCols.indexOf('shared.gridcol.UniversalField') === -1) {
				addCustomFields(true);
			}

			// Add the final definitions to the grid's columns config option
			this.columns = {
			    items: colDefs
			};
	    	
	    	this.callParent(arguments);
	    }
	};
});