/**
 * Grid column for GL Number
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.glaccount.gridcol.GLNumber', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.glaccount.gridcol.glnumber',

	requires: ['NP.lib.core.Config'],

	dataIndex: 'glaccount_number',

	initComponent: function() {
		this.text = 'GL Number';
		
		this.callParent(arguments);
	}
});