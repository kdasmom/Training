/**
 * Custom Field Header import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.CustomFieldHeader', {
    extend  : 'NP.view.importing.types.AbstractImportType',
    
    fieldName  : 'file_upload_custom_field_headers',

    // For localization
    tabTitle    : 'Header',
    entityName  : 'Custom Field Header',
    sectionName : 'Custom Field Header',
    instructions: 'To edit existing custom field values you must edit the values ' +
                    'directly in the custom field setup section in System Setup.',
    
    customField : "Custom Field",

	getGrid: function() {
        return {
			columns: {
				items: [
					{
						text: this.customField,
						dataIndex: 'CustomField'
					}
				]
			}
        }
    }
});