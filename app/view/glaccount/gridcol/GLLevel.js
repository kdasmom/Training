/**
 * Grid column for GL Level
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.glaccount.gridcol.GLLevel', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.glaccount.gridcol.gllevel',

	requires: ['NP.lib.core.Config'],

	dataIndex: 'glaccount_level',

	initComponent: function() {
		this.text = 'Category';
		
		this.callParent(arguments);
	}
});