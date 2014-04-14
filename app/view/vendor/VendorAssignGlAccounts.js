/**
 * @author Baranov A.V.
 * @date 10/4/13
 */

Ext.define('NP.view.vendor.VendorAssignGlAccounts', {
	extend: 'Ext.container.Container',
	alias: 'widget.vendor.vendorassignglaccounts',

	requires: [
		'NP.lib.core.Security',
		'NP.lib.ui.ComboBox',
        'NP.view.shared.GlAccountAssigner',
		'NP.lib.core.Translator'
	],

	padding: 8,

	title: 'Assign GL Accounts',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

	// Custom options

	initComponent: function() {
		var that = this;

		that.title = NP.Translator.translate(that.title);

        var glaccountsStore = Ext.create('NP.store.gl.GlAccounts', {
            service           : 'GLService',
            action            : 'getAll',
            extraParams: {
                pageSize: null
            }
        });
        glaccountsStore.load();

		this.defaults = {
			labelWidth: 150
		};

        this.items = [{
            xtype    : 'shared.glaccountassigner',
            store    : glaccountsStore,
            flex     : 1,
            hideLabel: true
        }];

        this.callParent(arguments);
	}
});