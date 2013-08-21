/**
 * GL Actual import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.PropertyGL', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    requires: [
        'NP.lib.core.Config'
    ],

    fieldName  : 'file_upload_property_gl',

    // For localization
    tabTitle            : NP.Config.getPropertyLabel() + ' GL Assignment',
    entityName          : NP.Config.getPropertyLabel() + ' GL Assignment',
    sectionName         : 'Property Setup',
    propertyCodeColText : 'Property Code',
    glCodeColText       : 'GL Code',
    intPkgColText       : 'Integration Package',
    
      getGrid: function() {
        return {
            columns: [
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
                    text     : this.glCodeColText,
                    dataIndex: 'GLCode',
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