/**
 * User Manager > Users tab
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.Users', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.user.users',

    requires: ['NP.lib.core.Translator'],

    title : 'Users',
    
    layout: 'fit',

    initComponent: function() {
        this.title = NP.Translator.translate(this.title);
        
        this.callParent(arguments);
    }
});