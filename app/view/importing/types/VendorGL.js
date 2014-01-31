/**
 * VendorGL import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.VendorGL', {
    extend  : 'NP.view.importing.types.AbstractImportType',
    
    fieldName  : 'file_upload_vendor_gl',

    // For localization
    tabTitle     : 'Vendor GL Assignment',
    entityName   : 'Vendor GL Assignments',
    sectionName  : 'the Vendor record',

    getGrid: function() {
        return {
            columns: {
                items: [
                    {
                        text     : 'Vendor Code',
                        dataIndex: 'vendor_id_alt'
                    },{
                        text     : 'GL Account Codes',
                        dataIndex: 'glaccount_number'
                    },{
                        text     : 'Integration Package',
                        dataIndex: 'integration_package_name'
                    }
                ]
            }
        };
    }

});
