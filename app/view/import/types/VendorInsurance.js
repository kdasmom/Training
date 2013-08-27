/**
 * Vendor Insurance import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.VendorInsurance', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    fieldName  : 'file_upload_vendor_insurance',

    // For localization
    tabTitle : 'Vendor Insurance',
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
                    text     : 'Integration Package Name',
                    dataIndex: 'Integration Package Name',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Vendor ID',
                    dataIndex: 'Vendor ID',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Insurance Type',
                    dataIndex: 'Insurance Type',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Company',
                    dataIndex: 'Company',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Policy Number',
                    dataIndex: 'Policy Number',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Effective Date',
                    dataIndex: 'Effective Date',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Expiration Date',
                    dataIndex: 'Expiration Date',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Policy Limit',
                    dataIndex: 'Policy Limit',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Additional Insured',
                    dataIndex: 'Additional Insured',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Property ID',
                    dataIndex: 'Property ID',
                    flex     : 1,
                    renderer : this.renderClosure
                }
            ]
        };
    }

});
