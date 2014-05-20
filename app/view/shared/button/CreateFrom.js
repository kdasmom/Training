/**
 * Created by Andrey Baranov
 * date: 4/22/2014 1:43 PM
 */


Ext.define('NP.view.shared.button.CreateFrom', {
	extend: 'Ext.button.Button',
	alias: 'widget.shared.button.createfrom',

	requires: ['NP.lib.core.Translator'],

	text: '',
	iconCls: 'create-from-btn',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.callParent(arguments);
	}
});