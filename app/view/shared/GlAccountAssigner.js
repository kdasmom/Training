/**
 * Created by rnixx on 10/7/13.
 */

Ext.define('NP.view.shared.GlAccountAssigner', {
    extend: 'NP.lib.ui.Assigner',
    alias: 'widget.shared.glaccountassigner',

    requires: ['NP.lib.core.Config'],

    fieldLabel: 'Assign GL accounts',
    name        : 'glaccounts',
    valueField  : 'glaccount_id',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    msgTarget   : 'under',
    tpl: '<tpl for="."><div class="x-boundlist-item">{[NP.model.gl.GlAccount.formatName(values.glaccount_number, values.glaccount_name)]}</div></tpl>',
    height: 200,

    initComponent: function() {
        if (!this.displayField) {
            this.displayField = (NP.Config.getSetting('PN.Budget.GLDisplayOrder', 'Number') == 'Name') ? 'glaccount_name' : 'glaccount_number';
        }

        if (!this.store) {
            this.store = Ext.create('NP.store.gl.GlAccounts', {
                service           : 'GLService',
                action            : 'getAll',
                autoLoad          : true,
                extraParams: {
                    pageSize: null
                }
            });
        }

        this.callParent(arguments);
    }
});