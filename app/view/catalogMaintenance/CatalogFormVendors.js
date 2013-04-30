/**
 * Catalog Maintenance add/edit form
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.CatalogFormVendors', {
    extend: 'Ext.ux.form.ItemSelector',
    alias: 'widget.catalogmaintenance.catalogformvendors',
    
    title: 'Vendor Assignment',

    name        : 'vc_vendors',
    hideLabel   : true, 
    store       : Ext.create('NP.store.vendor.Vendors', {
                    service    : 'VendorService',
                    action     : 'getByTaxId'
                  }),
    tpl         : '<tpl for="."><div class="x-boundlist-item">{vendor_name} ({vendor_id_alt})</div></tpl>',
    displayField: 'vendor_id',
    valueField  : 'vendor_id',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    buttons     : ['add','remove'],
    msgTarget   : 'under'
});