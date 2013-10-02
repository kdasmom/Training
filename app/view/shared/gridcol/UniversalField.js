/**
 * Grid column for Custom field
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.UniversalField', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.universalfield',

	requires: ['NP.lib.core.Config'],

	initComponent: function() {
		var cf = NP.Config.getCustomFields();

		this.dataIndex = 'universal_field' + this.fieldNumber;
		this.text = cf.header.fields[this.fieldNumber].label;

		this.callParent(arguments);
	}
});