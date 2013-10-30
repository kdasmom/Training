/**
 * GL Category import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.GLCategory', {
    extend  : 'NP.view.importing.types.AbstractImportType',
    
    fieldName  : 'file_upload_gl_category',

    // For localization
    tabTitle            : 'GL Category',
    entityName          : 'GLCategory',
    sectionName         : 'GL Account Setup',
    categoryColText     : 'Category Name',
    intPkgColText       : 'Integration Package',
    
      getGrid: function() {
        return {
            columns: {
                items: [
                    {
                        text     : this.categoryColText,
                        dataIndex: 'glaccount_name'
                    },{
                        text     : this.intPkgColText, 
                        dataIndex: 'integration_package_name'
                    }
                ]
            }
        };
    }

});