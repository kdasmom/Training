/**
 * My Settings section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.CatalogRegister', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.catalogmaintenance.catalogregister',
    
    requires: [
        'NP.view.catalogMaintenance.CatalogGrid'
    ],

    title: 'Vendor Catalog Maintenance',
    
    items: [
        { xtype: 'catalogmaintenance.cataloggrid', type: 'activated', title: 'Activated Catalogs', vc_status: '1,0' },
        { xtype: 'catalogmaintenance.cataloggrid', type: 'pending', title: 'Pending Catalogs', vc_status: '-1,-2' }
    ]
});