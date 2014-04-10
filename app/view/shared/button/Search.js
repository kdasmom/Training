/**
 * Created by Andrey Baranov
 * date: 11/26/13 4:44 PM
 */

Ext.define('NP.view.shared.button.Search', {
	extend: 'Ext.button.Button',
	alias: 'widget.shared.button.search',

	requires: ['NP.lib.core.Translator'],

	text   : 'Search',
	iconCls: 'search-btn',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.callParent(arguments);
	}
});