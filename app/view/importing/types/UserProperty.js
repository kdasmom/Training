/**
 * User Property Assignment type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.UserProperty', {
    extend  : 'NP.view.importing.types.AbstractImportType',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator'
    ],

    fieldName  : 'file_upload_user_property',

    constructor: function() {
        var me = this;

        me.callParent(arguments);

        me.translateText();
    },

    getGrid: function() {
        return {
            columns: {
                items: [
                    {   text: this.usernameColText, 
                        dataIndex: 'userprofile_username'
                    },{
                        text     : this.propertyCodeColText,
                        dataIndex: 'property_id_alt'
                    }
                ]
            }
        };
    },

    translateText: function() {
        var me = this,
            propertyText = NP.Config.getPropertyLabel();

        me.tabTitle            = NP.Translator.translate('User {property} Assignment', { property: propertyText });
        me.entityName          = NP.Translator.translate('User {property} Assignments', { property: propertyText });
        me.sectionName         = NP.Translator.translate('User Manager');
        me.usernameColText     = NP.Translator.translate('Username');
        me.propertyCodeColText = NP.Translator.translate('{property} Code', { property: propertyText });
    }
});