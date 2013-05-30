/**
 * Property Setup > Integration Package section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.Region', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.property.region',
    
    title: NP.Config.getSetting('PN.main.RegionLabel', 'Region'),

    html: 'Coming soon...',

    initComponent: function() {
    	this.callParent(arguments);
    }
});