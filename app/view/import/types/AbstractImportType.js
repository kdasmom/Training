/**
 * Abstract Import Type
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.AbstractImportType', {
    
    getImportForm: function() {
        Ext.each(['tabTitle','entityName','sectionName','fieldName'], function(option) {
            if (!option in this) {
                throw 'To use the default upload form, you need to specify the "' + option + '" config';
            }    
        });

        return Ext.create('NP.view.import.UploadForm', {
            entityName : this.entityName,
            sectionName: this.sectionName,
            fieldName  : this.fieldName
        });
    },

    getGrid: function() {
        throw 'You must override this function in your import type implementation';
    }

});