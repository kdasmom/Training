/**
 * Upload button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.button.Camera', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.camera',

    requires: ['NP.lib.core.Translator'],

    text        : 'Camera',
    iconCls     : 'camera-btn',
    componentCls: 'camera-button',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});