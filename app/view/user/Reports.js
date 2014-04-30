/**
 * User Manager > Reports tab
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.Reports', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.user.reports',
    
    title: 'Reports',

    initComponent: function() {
        this.title = NP.Translator.translate(this.title);
    	this.callParent(arguments);
    }
});