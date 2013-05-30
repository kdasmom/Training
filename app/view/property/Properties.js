/**
 * Property Setup > Properties section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.Properties', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.property.properties',
    
    title: NP.Config.getPropertyLabel(true),

    layout: 'fit'
});