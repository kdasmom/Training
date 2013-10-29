/**
 * GL Actual import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.PropertyGL', {
    extend  : 'NP.view.importing.types.AbstractImportType',
    
    requires: [
        'NP.lib.core.Config'
    ],

    fieldName  : 'file_upload_property_gl',

    // For localization
    tabTitle            : 'Property GL Assignment',
    entityName          : 'Property GL Assignment',
    sectionName         : 'Property Setup',
    propertyCodeColText : 'Property Code',
    glCodeColText       : 'GL Code',
    intPkgColText       : 'Integration Package',
    
    getGrid: function() {
        return {
            columns: {
                items: [
                    {
                        text     : this.propertyCodeColText,
                        dataIndex: 'property_id_alt'
                    },{
                        text     : this.glCodeColText,
                        dataIndex: 'glaccount_number'
                    },{
                        text     : this.intPkgColText, 
                        dataIndex: 'integration_package_name'
                    }
                ]
            }
        };
    }

});