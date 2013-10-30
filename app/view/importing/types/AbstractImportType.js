/**
 * Abstract Import Type
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.AbstractImportType', {
    
    getImportForm: function() {
        Ext.each(['tabTitle','entityName','sectionName','fieldName'], function(option) {
            if (!option in this) {
                throw 'To use the default upload form, you need to specify the "' + option + '" config';
            }    
        });

        return Ext.create('NP.view.importing.UploadForm', {
            entityName : this.entityName,
            sectionName: this.sectionName,
            fieldName  : this.fieldName
        });
    },

    getGrid: function() {
        throw 'You must override this function in your import type implementation';
    },

    getColumnRenderer: function(val, meta, rec, arg4, colIdx) {
        var dataIndex = this.columns[colIdx].dataIndex;
        if (dataIndex in rec.get('validation_errors')) {
            meta.tdAttr = 'data-qtip="' + rec.get('validation_errors')[dataIndex] + '"';
            return "<span style='color:red;font-weight:bold' >" + val + "</span>";
        } else {
            return val;
        }
    }

});