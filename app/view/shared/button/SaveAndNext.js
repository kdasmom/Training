/**
 * Save and Next button
 */
Ext.define('NP.view.shared.button.SaveAndNext', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.saveandnext',

	text        : 'Save and Next',
	iconCls     : 'save-and-next-btn',
	componentCls: 'save-and-btn',


	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.callParent(arguments);
	}
});