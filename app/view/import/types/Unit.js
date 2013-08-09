/**
 * Unit import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.Unit', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    requires: [
        'NP.lib.core.Config'
    ],

    fieldName  : 'file_upload_unit',

    // For localization
    tabTitle : NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit'),
    entityName : '',
    sectionName: '',

    getGrid: function() {
        
    }

});