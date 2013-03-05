/**
 * A Provider implementation which saves and retrieves state via cookies. The CookieProvider supports the usual cookie
 * options, such as:
 *
 * - {@link #path}
 * - {@link #expires}
 * - {@link #domain}
 * - {@link #secure}
 *
 * Example:
 *
 *     var cp = Ext.create('Ext.state.CookieProvider', {
 *         path: "/cgi-bin/",
 *         expires: new Date(new Date().getTime()+(1000*60*60*24*30)), //30 days
 *         domain: "sencha.com"
 *     });
 *
 *     Ext.state.Manager.setProvider(cp);
 *
 */
Ext.define('NP.DBProvider', {
    extend: 'Ext.state.Provider',

    requires: ['NP.core.Config'],

    /**
     * Creates a new CookieProvider.
     * @param {Object} [config] Config object.
     */
    constructor: function(config){
        this.callParent(arguments);
        this.state = NP.core.Config.getUserSettings();
        console.log(this.state['invoice_register_open']['sort']['direction']);
    },

    // private
    set: function(name, value){
        console.log('Setting grid state');
        console.log(name);
        console.log(value);
        /*NP.core.Config.saveUserSetting(name, value);
        this.callParent(arguments);*/
    }
});
