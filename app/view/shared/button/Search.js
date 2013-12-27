/**
 * Search button
 * Created by rnixx on 10/15/13.
 */
Ext.define('NP.view.shared.button.Search', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.search',

    text   : 'Search',
    iconCls: 'search-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});