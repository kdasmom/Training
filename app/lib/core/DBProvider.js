/**
 * A Provider implementation which saves state to the database via an ajax call.
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.core.DBProvider', {
    extend: 'Ext.state.Provider',

    requires: ['NP.lib.core.Config'],

    constructor: function(cfg){
        // Call the abstract provider constructor, which will initiate some variables
        this.callParent(arguments);
        // Populate the state object with data from the Config object
        this.state = NP.lib.core.Config.getUserSettings();
    },

    /**
     * Saves a name/value pair for state to the database
     */
    set: function(name, value){
        // Use the Config object to save the state in the database
        NP.lib.core.Config.saveUserSetting(name, value);
        // Call the abstract provider's set() function to save the name/value pair in the state object
        this.callParent(arguments);
    }
});
