/**
 * A Provider implementation which saves and retrieves state via the database through an ajax call.
 *
 */
Ext.define('NP.lib.core.DBProvider', {
    extend: 'Ext.state.Provider',

    requires: ['NP.lib.core.Config'],

    constructor: function(config){
        this.callParent(arguments);
        this.state = NP.lib.core.Config.getUserSettings();
    },

    set: function(name, value){
        NP.lib.core.Config.saveUserSetting(name, value);
        this.callParent(arguments);
    }
});
