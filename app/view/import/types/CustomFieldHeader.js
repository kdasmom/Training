/**
 * Custom Field Header import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.CustomFieldHeader', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    fieldName  : 'file_upload_custom_field_headers',

    // For localization
    tabTitle : 'Header',
    entityName : 'Custom Field Header',
    sectionName: 'Custom Field Header',
    customField : "Custom Field",

    getGrid: function() {
        return {
            columns: [
                { text: this.customField, dataIndex: 'CustomField', flex: 1 }                
            ]
        }
    }
});