/**
 * Created by Andrey Baranov
 * date: 1/14/14 5:33 PM
 */


Ext.define('NP.view.shared.button.PropertySetup', {
	extend: 'Ext.button.Button',
	alias: 'widget.shared.button.propertysetup',

	requires: ['NP.lib.core.Translator'],

	text   : 'Property Setup',
	iconCls: 'propertysetup-btn',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.callParent(arguments);
	}
});