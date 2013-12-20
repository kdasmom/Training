/**
 * Grid column for Needed By Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.image.gridcol.NeededByDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.image.gridcol.neededbydate',

	requires: ['NP.lib.core.Translator'],

	text     : 'Needed By',
	dataIndex: 'image_index_NeededBy_datetm',

	renderer: function(val, meta, rec) {
		if (rec.get('invoice_id') !== null) {
			val = rec.get('invoice_NeededBy_datetm');
		}

		return Ext.Date.format(val, Ext.Date.defaultFormat);
	},

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});