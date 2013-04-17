/**
 * My Settings section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.Register', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.catalogmaintenance.register',
    
    requires: [
        'NP.view.catalogMaintenance.GridActivated',
        'NP.view.catalogMaintenance.GridPending'
    ],

    title: 'Vendor Catalog Maintenance',
    
    items: [
        { xtype: 'catalogmaintenance.gridactivated' },
        { xtype: 'catalogmaintenance.gridpending' }
    ]
});