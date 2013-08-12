/**
 * GL Category import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.GLCategory', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    fieldName  : 'file_upload_gl_category',

    // For localization
    tabTitle            : 'GL Category',
    entityName          : 'GLCategory',
    sectionName         : 'GL Account Setup',
    categoryColText     : 'Category Name',
    intPkgColText       : 'Integration Package',
    
      getGrid: function() {
        return {
            columns: [
                {
                    text     : this.categoryColText,
                    dataIndex: 'CategoryName',
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