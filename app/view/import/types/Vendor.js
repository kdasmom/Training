/**
 * Vendor import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.Vendor', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    fieldName  : 'file_upload_vendor',

    // For localization
    tabTitle : 'Vendor',
    entityName : 'Vendor',
    sectionName: 'Vendor Setup',

    renderClosure: function(val, meta, rec) {
        if(!val) {
            console.error('Arguments', arguments);
            return;
        }
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
                    text     : 'Vendor ID',
                    dataIndex: 'Vendor ID',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Name',
                    dataIndex: 'Name',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Federal ID',
                    dataIndex: 'Federal ID',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Tax Report Name',
                    dataIndex: 'Tax Report Name',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Status',
                    dataIndex: 'Status',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Vendor Type',
                    dataIndex: 'Vendor Type',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Pay Priority',
                    dataIndex: 'Pay Priority',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Created Date',
                    dataIndex: 'Created Date',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Last Update Date',
                    dataIndex: 'Last Update Date',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Reportable',
                    dataIndex: 'Reportable',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Term Date Basis',
                    dataIndex: 'Term Date Basis',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Pay Date Basis',
                    dataIndex: 'Pay Date Basis',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Default GL code',
                    dataIndex: 'Default GL code',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Phone',
                    dataIndex: 'Phone',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Fax',
                    dataIndex: 'Fax',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Address 1',
                    dataIndex: 'Address 1',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Address 2',
                    dataIndex: 'Address 2',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'City',
                    dataIndex: 'City',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'State',
                    dataIndex: 'State',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Zip Code',
                    dataIndex: 'Zip Code',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Contact Last Name',
                    dataIndex: 'Contact Last Name',
                    flex     : 1,
                    renderer : this.renderClosure
                },

                {
                    text     : 'Contact First Name',
                    dataIndex: 'Contact First Name',
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
        }
    }

});
