/**
 * VendorGL import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.VendorGL', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    fieldName  : 'file_upload_vendor_gl',

    // For localization
    tabTitle : 'Vendor GL Assignment',
    entityName : '',
    sectionName: '',

    renderClosure: function(val, meta, rec) {
        var value = val.split(';');
        if (value[1]) {
            meta.tdAttr = 'data-qtip="' + value[1] + '"';
            return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
        } else {
            return val;
        }
    },

    getGrid: function() {
        return {
            columns: [
                {
                    text     : 'Vendor Code',
                    dataIndex: 'VendorCode',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'GL Account Codes',
                    dataIndex: 'GLCodes',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Integration Package',
                    dataIndex: 'Integration Package',
                    flex     : 1,
                    renderer : this.renderClosure
                }

            ]
        };
    }

});
