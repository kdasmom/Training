/**
 * User Property Assignment type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.UserProperty', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    requires: [
      'NP.lib.core.Config'
    ],

    fieldName  : 'file_upload_user_property',

    // For localization
    tabTitle : 'User ' + NP.Config.getPropertyLabel() + ' Assignment',
    entityName : '',
    sectionName: '',

    getGrid: function() {
        
    }

});