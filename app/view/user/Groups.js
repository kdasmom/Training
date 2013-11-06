/**
 * User Manager > User Groups tab
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.Groups', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.user.groups',
   	
   	// For localization 
    title: 'User Groups',

    layout: 'fit',

	initComponent: function() {
		this.title = NP.Translator.translate(this.title);
		
		this.callParent(arguments);
	}
});