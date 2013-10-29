/**
 * Split import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.Split', {
    extend  : 'NP.view.importing.types.AbstractImportType',
    
    fieldName  : 'file_upload_split',

    // For localization
    tabTitle                 : 'Splits',
    entityName               : 'Split',
    sectionName              : 'Split Setup',
    colTextIntegrationPackage: 'Integration Package',
    colTextSplitName         : 'Split Name',
    colTextVendorCode        : 'Vendor Code',
    colTextPropertyCode      : 'Property Code',
    colTextGLCode            : 'GL Code',
    colTextDepartment        : 'Department',
    colTextCustomField1      : 'Custom Field 1',
    colTextCustomField2      : 'Custom Field 2',
    colTextCustomField3      : 'Custom Field 3',
    colTextCustomField4      : 'Custom Field 4',
    colTextCustomField5      : 'Custom Field 5',
    colTextCustomField6      : 'Custom Field 6',
    colTextPercent           : 'Percent',
    
    getGrid: function() {
        return {
            columns: {
                items: [
                    { text: this.colTextIntegrationPackage, dataIndex: 'integration_package_name' },
                    { text: this.colTextSplitName, dataIndex: 'dfsplit_name' },
                    { text: this.colTextVendorCode, dataIndex: 'vendor_id_alt' },
                    { text: this.colTextPropertyCode, dataIndex: 'property_id_alt' },
                    { text: this.colTextGLCode, dataIndex: 'glaccount_number' },
                    { text: this.colTextDepartment, dataIndex: 'unit_id_alt' },
                    { text: this.colTextCustomField1, dataIndex: 'universal_field1' },
                    { text: this.colTextCustomField2, dataIndex: 'universal_field2' },
                    { text: this.colTextCustomField3, dataIndex: 'universal_field3' },
                    { text: this.colTextCustomField4, dataIndex: 'universal_field4' },
                    { text: this.colTextCustomField5, dataIndex: 'universal_field5' },
                    { text: this.colTextCustomField6, dataIndex: 'universal_field6' }
                ]
            }
        };
    }

});