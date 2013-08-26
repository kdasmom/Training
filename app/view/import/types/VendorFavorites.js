/**
 * Vendor Favorites import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.VendorFavorites', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
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
            columns: [
                {
                    text     : this.vendorCodeColText,
                    dataIndex: 'VendorCode',
                    flex     : 1,
                    renderer : function(val, meta, rec) {
                        var value = val.split(';');
                        if (value[1]) {
                            meta.tdAttr = 'data-qtip="' + value[1] + '"';
                            return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
                        } else {
                            return val;
                        }
                    }},
                {
                    text     : this.propertyCodeColText,
                    dataIndex: 'PropertyCode',
                    flex     : 1,
                    renderer : function(val, meta, rec) {
                        var value = val.split(';');
                        if (value[1]) {
                            meta.tdAttr = 'data-qtip="' + value[1] + '"';
                            return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
                        } else {
                            return val;
                        }
                    }},
                {
                    text     : this.intPkgColText, 
                    dataIndex: 'IntegrationPackage',
                    flex     : 1,
                    renderer : function(val, meta, rec) {
                        var value = val.split(';');
                        if (value[1]) {
                            meta.tdAttr = 'data-qtip="' + value[1] + '"';
                            return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
                        } else {
                            return val;
                        }
                    }
                }
            ]
        };
    }

});