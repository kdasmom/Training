/**
 * Generic combo for GL Accounts
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.GlCombo', {
    extend: 'NP.lib.ui.AutoComplete',
    alias: 'widget.shared.glcombo',
    
    requires: ['NP.model.gl.GlAccount'],

    fieldLabel: 'GL Account',

    name                : 'glaccount_id',
    displayField        : 'display_name',
    valueField          : 'glaccount_id',
    queryParam          : 'glaccount_keyword',
    width               : 400,
    tpl                 : '<tpl for=".">' +
                            '<li class="x-boundlist-item" role="option">{[NP.model.gl.GlAccount.formatName(values.glaccount_number, values.glaccount_name)]}</li>' +
                        '</tpl>',

    initComponent: function() {
		var me = this;

        if (!this.store) {
            this.store = Ext.create('NP.store.gl.GlAccounts', {
                           service : 'GLService',
                           action  : 'getByIntegrationPackage',
						   autoLoad: (me.storeAutoLoad) ? me.storeAutoLoad : false,
				           listeners: (me.storeListeners) ? me.storeListeners : {}
                        });
        }

        this.callParent(arguments);
    }
});