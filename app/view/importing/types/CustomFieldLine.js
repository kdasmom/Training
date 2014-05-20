/**
 * Custom Field Line Items import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.CustomFieldLine', {
    extend  : 'NP.view.importing.types.AbstractImportType',
    
    fieldName  : 'file_upload_custom_field_lines',

    // For localization
    tabTitle    : 'Line Item',
    entityName  : 'Custom Field Line',
    sectionName : 'Custom Field Line',
    instructions: '<ul>' +
                        '<li>' +
                            'To add values to the GL specific custom field you must ' +
                            'input the values directly in the custom field setup ' +
                            'section in System Setup.' +
                        '</li>' +
                        '<li>' +
                            'To edit existing custom field values you must edit the values ' +
                            'directly in the custom field setup section in System Setup.' +
                        '</li>' +
                    '</ul>',

    customField : "Custom Field",

    getGrid: function() {
        return {
            columns:{
				items:[
					{ text: this.customField, dataIndex: 'CustomField', flex: 1 }
				]
			}
        }
    }
});