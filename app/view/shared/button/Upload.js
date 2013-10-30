/**
 * Upload button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.button.Upload', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.upload',

    requires: ['NP.lib.core.Translator'],

    text   : 'Upload',
    iconCls: 'upload-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});