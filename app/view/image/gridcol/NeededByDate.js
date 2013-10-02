/**
 * Grid column for Needed By Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.image.gridcol.NeededByDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.image.gridcol.neededbydate',

	text     : 'Needed By',
	dataIndex: 'image_index_NeededBy_datetm',

	renderer: function(val, meta, rec) {
		if (rec.raw['invoice_id']) {
			val = rec.getInvoice().get('invoice_NeededBy_datetm');
		}

		return Ext.Date.format(val, Ext.Date.defaultFormat);
	}
});