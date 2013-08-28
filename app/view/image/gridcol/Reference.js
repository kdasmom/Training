/**
 * Grid column for Image Due Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.image.gridcol.Reference', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.image.gridcol.reference',

	text     : 'Reference',
	dataIndex: 'Image_Index_Ref',

	renderer: function(val, meta, rec) {
		if (rec.raw['invoice_id']) {
			return rec.getInvoice().get('invoice_ref');
		}

		return val;
	}
});