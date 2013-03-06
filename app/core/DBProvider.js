/**
 * A Provider implementation which saves and retrieves state via the database through an ajax call.
 *
 */
Ext.define('NP.core.DBProvider', {
    extend: 'Ext.state.Provider',

    requires: ['NP.core.Config'],

    constructor: function(config){
        this.callParent(arguments);
        this.state = NP.core.Config.getUserSettings();
    },

    set: function(name, value){
        NP.core.Config.saveUserSetting(name, value);
        this.callParent(arguments);
    }
});
