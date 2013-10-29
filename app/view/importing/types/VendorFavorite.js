/**
 * Vendor Favorites import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.VendorFavorite', {
    extend  : 'NP.view.importing.types.AbstractImportType',
    
    fieldName  : 'file_upload_vendor_favorites',

    // For localization
    tabTitle            : 'Vendor Favorites',
    entityName          : 'Vendor Favorites',
    sectionName         : 'Vendor Setup',
    vendorCodeColText   : 'Vendor Code',
    propertyCodeColText : 'Property Code',
    intPkgColText       : 'Integration Package',
    
      getGrid: function() {
        return {
            columns: {
                items: [
                    {
                        text     : this.vendorCodeColText,
                        dataIndex: 'vendor_id_alt'
                    },{
                        text     : this.propertyCodeColText,
                        dataIndex: 'property_id_alt'
                    },{
                        text     : this.intPkgColText, 
                        dataIndex: 'integration_package_name'
                    }
                ]
            }
        };
    }

});