/**
 * Catalog Maintenance add/edit form
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.CatalogFormCategories', {
    extend: 'Ext.ux.form.ItemSelector',
    alias: 'widget.catalogmaintenance.catalogformcategories',
    
    title: 'Categories',

    name        : 'vc_categories',
    hideLabel   : true, 
    store       : 'catalog.VcCats',
    displayField: 'vccat_name',
    valueField  : 'vccat_id',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    buttons     : ['add','remove'],
    msgTarget   : 'under'
});