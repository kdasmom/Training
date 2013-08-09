/**
 * Unit type import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.UnitType', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    fieldName  : 'file_upload_unit_type',

    // For localization
    tabTitle : NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit') + ' Type',
    entityName : '',
    sectionName: '',

    getGrid: function() {
        
    }

});