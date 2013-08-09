/**
 * GL Actual import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.Property', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    requires: ['NP.lib.core.Config'],

    fieldName  : 'file_upload_property',

    // For localization
    tabTitle : NP.Config.getPropertyLabel(),
    entityName : '',
    sectionName: '',

    getGrid: function() {
        
    }

});