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

	getGrid: function(value) {
        return {
			columns: {
				items: [
					{
						text: this.setColumnType(value),
						dataIndex: 'CustomField'
					}
				]
			}
        }
    },

	setColumnType: function(value) {
		var me = this;

		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'ConfigService',
				action : 'getCustomFieldName',
				customfield_number     : value,
				type: 'header',
				success: function(success) {
					me.customField = success;
				}
			}
		});

		return me.customField;
	}
});