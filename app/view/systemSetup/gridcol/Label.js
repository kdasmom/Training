/**
 * Created by Andrey Baranov
 * date: 1/21/14 2:13 PM
 */

Ext.define('NP.view.systemSetup.gridcol.Label', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.systemsetup.gridcol.label',

	requires: ['NP.lib.core.Translator'],

	text     : 'Label',
	dataIndex: 'controlpanelitem_value',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.callParent(arguments);
	}
});