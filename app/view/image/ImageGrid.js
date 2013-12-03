/**
 * A component to easily create a Receipt Grid
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.image.ImageGrid', {
	extend: 'NP.lib.ui.Grid',
 	alias : 'widget.image.imagegrid',

    requires: [
    	'NP.lib.core.Config',
    	'NP.view.image.gridcol.ScanDate',
    	'NP.view.image.gridcol.InvoiceDate',
    	'NP.view.image.gridcol.DueDate',
    	'NP.view.image.gridcol.Name',
		'NP.view.property.gridcol.PropertyName',
		'NP.view.property.gridcol.PropertyCode',
		'NP.view.vendor.gridcol.VendorName',
		'NP.view.image.gridcol.NeededByDate',
		'NP.view.vendor.gridcol.VendorCode',
		'NP.view.image.gridcol.Reference',
		'NP.view.image.gridcol.Amount',
		'NP.view.shared.gridcol.PriorityFlag',
		'NP.view.image.gridcol.DaysOutstanding',
		'NP.view.image.gridcol.Source',
		'NP.view.image.gridcol.DocType',
		'NP.view.shared.gridcol.PendingDays',
		'NP.view.image.gridcol.ExceptionBy',
		'NP.view.shared.gridcol.UniversalField',
		'NP.view.image.gridcol.ImageStatus',
		'NP.view.image.gridcol.InvoiceNumber',
		'NP.view.image.gridcol.ExceptionDate',
		'NP.view.image.gridcol.DeleteDate',
		'NP.view.image.gridcol.DeletedBy',
		'NP.view.image.gridcol.RefNumber',
		'NP.view.image.gridcol.ImageType',
		'NP.view.image.gridcol.DocumentType',
		'NP.view.image.gridcol.Type',
		'NP.view.image.gridcol.ScanSource'
    ],
    
    // This is the default list of columns available for Invoice grids
	colOptions: ['image.gridcol.ScanDate','image.gridcol.InvoiceDate','image.gridcol.DueDate','image.gridcol.Name',
				'property.gridcol.PropertyName','property.gridcol.PropertyCode','vendor.gridcol.VendorName',
				'image.gridcol.NeededByDate','vendor.gridcol.VendorCode','image.gridcol.Reference','image.gridcol.Amount',
				'shared.gridcol.PriorityFlag','image.gridcol.DaysOutstanding','image.gridcol.Source','image.gridcol.DocType',
				'shared.gridcol.PendingDays','image.gridcol.ExceptionBy', 'image.gridcol.ExceptionDate',
                'image.gridcol.DeleteDate', 'image.gridcol.DeletedBy', 'image.gridcol.RefNumber',
                'image.gridcol.ImageType', 'image.gridcol.DocumentType', 'image.gridcol.Type', 'image.gridcol.ScanSource'],

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