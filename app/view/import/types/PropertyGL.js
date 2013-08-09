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
    tabTitle : NP.Config.getPropertyLabel() + ' GL Assignment',
    entityName : '',
    sectionName: '',

    getGrid: function() {
        
    }

});