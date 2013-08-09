/**
 * Vendor Favorites import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.VendorFavorites', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    fieldName  : 'file_upload_vendor_favorites',

    // For localization
    tabTitle : 'Vendor Favorites',
    entityName : '',
    sectionName: '',

    getGrid: function() {
        
    }

});