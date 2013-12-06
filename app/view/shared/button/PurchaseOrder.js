/**
 * Created by Andrey Baranov
 * date: 12/6/13 4:18 PM
 */

Ext.define('NP.view.shared.button.PurchaseOrder', {
	extend: 'Ext.button.Button',
	alias: 'widget.shared.button.purchaseorder',

	requires: ['NP.lib.core.Translator'],

	text: 'Print',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.callParent(arguments);
	}
});