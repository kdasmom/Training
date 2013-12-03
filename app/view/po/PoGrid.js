/**
 * A component to easily create a PO Grid
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.PoGrid', {
	extend: 'NP.lib.ui.Grid',
 	alias : 'widget.po.pogrid',

    requires: [
    	'NP.lib.core.Config',
    	'NP.view.property.gridcol.PropertyName',
    	'NP.view.property.gridcol.PropertyCode',
    	'NP.view.vendor.gridcol.VendorName',
		'NP.view.vendor.gridcol.VendorCode',
		'NP.view.po.gridcol.Date',
		'NP.view.po.gridcol.CreatedDate',
		'NP.view.po.gridcol.NeededByDate',
		'NP.view.shared.gridcol.CreatedBy',
		'NP.view.po.gridcol.Period',
		'NP.view.po.gridcol.Number',
		'NP.view.shared.gridcol.Amount',
		'NP.view.shared.gridcol.PendingDays',
		'NP.view.po.gridcol.Status',
		'NP.view.shared.gridcol.PriorityFlag',
		'NP.view.shared.gridcol.LastApprovedDate',
		'NP.view.shared.gridcol.LastApprovedBy',
		'NP.view.shared.gridcol.RejectedBy',
		'NP.view.shared.gridcol.RejectedDate',
		'NP.view.shared.gridcol.PendingApprovalDays',
		'NP.view.po.gridcol.SentToVendor',
		'NP.view.po.gridcol.ReceiptRequired',
		'NP.view.po.gridcol.Notes',
		'NP.view.po.gridcol.BudgetNotes',
    	'NP.view.shared.gridcol.UniversalField'
    ],

	// This is the default list of columns available for Invoice grids
	colOptions: ['property.gridcol.PropertyName','property.gridcol.PropertyCode','vendor.gridcol.VendorName',
				'vendor.gridcol.VendorCode','po.gridcol.Date','po.gridcol.CreatedDate','po.gridcol.NeededByDate',
				'shared.gridcol.CreatedBy','po.gridcol.Period', 'po.gridcol.Number','shared.gridcol.Amount',
				'shared.gridcol.PendingDays','po.gridcol.Status','shared.gridcol.PriorityFlag','shared.gridcol.LastApprovedDate',
				'shared.gridcol.LastApprovedBy','shared.gridcol.RejectedBy','shared.gridcol.RejectedDate',
				'shared.gridcol.PendingApprovalDays','po.gridcol.SentToVendor','po.gridcol.ReceiptRequired',
				'po.gridcol.Notes','po.gridcol.BudgetNotes'],
    
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
				if (field.poOn) {
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
		for (var i=0; i<this.colOptions.length; i++) {
			// Lower case the options because they are camel cased for the requires, but need to be lower cased
			var col = this.colOptions[i];
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
});