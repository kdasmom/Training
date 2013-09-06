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
    entityName : 'User ' + NP.Config.getPropertyLabel() + ' Assignment',
    sectionName: 'User Property',
    usernameColText : 'Username',
    propertyCodeColText : 'Property Code',
    
    getGrid: function() {
        return {
            columns: [
                {   text: this.usernameColText, 
                    dataIndex: 'Username', 
                    flex: 1,
                    renderer : function(val, meta, rec) {
                        var value = val.split(';');
                        if (value[1]) {
                            meta.tdAttr = 'data-qtip="' + value[1] + '"';
                            return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
                        } else {
                            return val;
                        }
                    }},
                {
                    text     : this.propertyCodeColText,
                    dataIndex: 'PropertyCode',
                    flex     : 1,
                    renderer : function(val, meta, rec) {
                        var value = val.split(';');
                        if (value[1]) {
                            meta.tdAttr = 'data-qtip="' + value[1] + '"';
                            return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
                        } else {
                            return val;
                        }
                    }},
            ]
        };
    }

});