/**
 * Catalog Maintenance add/edit form
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.CatalogFormCategories', {
    extend: 'Ext.ux.form.ItemSelector',
    alias: 'widget.catalogmaintenance.catalogformcategories',

    requires: ['NP.store.catalog.VcCats'],
    
    title: 'Categories',

    name        : 'vc_categories',
    hideLabel   : true, 
    store       : {
        type    : 'catalog.vccats',
        autoLoad: true
    },
    displayField: 'vccat_name',
    valueField  : 'vccat_id',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    buttons     : ['add','remove'],
    msgTarget   : 'under'
});