/**
 * Custom Field Line Items import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.CustomFieldLine', {
    extend  : 'NP.view.importing.types.AbstractImportType',
    
    fieldName  : 'file_upload_custom_field_lines',

    // For localization
    tabTitle : 'Line Item',
    entityName : 'Custom Field Line',
    sectionName: 'Custom Field Line',
    customField : "Custom Field",

    getGrid: function() {
        return {
            columns: [
                { text: this.customField, dataIndex: 'CustomField', flex: 1 }                
            ]
        }
    }
});