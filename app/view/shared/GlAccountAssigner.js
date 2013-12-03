/**
 * Created by rnixx on 10/7/13.
 */

Ext.define('NP.view.shared.GlAccountAssigner', {
    extend: 'Ext.ux.form.ItemSelector',
    alias: 'widget.shared.glaccountassigner',

    requires: ['NP.lib.core.Config'],

    fieldLabel: 'Assign GL accounts',
    name        : 'glaccounts',
    displayField: 'glaccount_name',
    valueField  : 'glaccount_id',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    buttons     : ['add','remove'],
    msgTarget   : 'under',
    tbl: '<tpl for="."><div class="x-boundlist-item">{glaccount_name}</div></tpl>',
    height: 200,

    initComponent: function() {
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