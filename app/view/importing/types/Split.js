/**
 * Split import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.Split', {
    extend  : 'NP.view.importing.types.AbstractImportType',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator'
    ],

    fieldName  : 'file_upload_split',

    constructor: function() {
        var me = this;

        me.callParent(arguments);

        me.translateText();
    },
    
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
    },

    translateText: function() {
        var me = this;

        me.tabTitle    = NP.Translator.translate('Splits');
        me.entityName  = NP.Translator.translate('Split');
        me.sectionName = NP.Translator.translate('Split Setup');
        me.instructions= NP.Translator.translate(
            'When creating Vendor Default Splits, please ensure that the '+
            '{property} has rights to the GL Code prior to uploading the .csv file.',
            { property: NP.Config.getPropertyLabel() }
        );

        me.colTextIntegrationPackage= NP.Translator.translate('Integration Package');
        me.colTextSplitName         = NP.Translator.translate('Split Name');
        me.colTextVendorCode        = NP.Translator.translate('Vendor Code');
        me.colTextPropertyCode      = NP.Translator.translate('Property Code');
        me.colTextGLCode            = NP.Translator.translate('GL Code');
        me.colTextDepartment        = NP.Translator.translate('Department');
        me.colTextCustomField1      = NP.Translator.translate('Custom Field 1');
        me.colTextCustomField2      = NP.Translator.translate('Custom Field 2');
        me.colTextCustomField3      = NP.Translator.translate('Custom Field 3');
        me.colTextCustomField4      = NP.Translator.translate('Custom Field 4');
        me.colTextCustomField5      = NP.Translator.translate('Custom Field 5');
        me.colTextCustomField6      = NP.Translator.translate('Custom Field 6');
        me.colTextPercent           = NP.Translator.translate('Percent');
    }
});