/**
 * Catalog Maintenance add/edit form
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.CatalogFormVendors', {
    extend: 'NP.lib.ui.Assigner',
    alias: 'widget.catalogmaintenance.catalogformvendors',
    
    requires: ['NP.store.vendor.Vendors'],

    title: 'Vendor Assignment',

    name        : 'vc_vendors',
    hideLabel   : true, 
    store       : {
                    type   : 'vendor.vendors',
                    service: 'VendorService',
                    action : 'getByTaxId'
                  },
    tpl         : '<tpl for="."><div class="x-boundlist-item">{vendor_name} ({vendor_id_alt})</div></tpl>',
    displayField: 'vendor_id',
    valueField  : 'vendor_id',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    msgTarget   : 'under'
});