/**
 * Created by rnixx on 11/6/13.
 */

Ext.define('NP.view.image.gridcol.InvoiceNumber', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.image.gridcol.invoicenumber',

	text     : 'Ref number',
	dataIndex: 'invoice_number',

	renderer: function(val, meta, rec) {
		return val;
	}
});