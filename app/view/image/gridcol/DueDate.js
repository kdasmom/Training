/**
 * Grid column for Image Due Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.image.gridcol.DueDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.image.gridcol.duedate',

	text     : 'Due Date',
	dataIndex: 'Image_Index_Due_Date',

	renderer: function(val, meta, rec) {
		if (rec.raw['invoice_id']) {
			val = rec.getInvoice().get('invoice_duedate');
		}

		return Ext.Date.format(val, Ext.Date.defaultFormat);
	}
});