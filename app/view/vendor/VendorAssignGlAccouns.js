/**
 * @author Baranov A.V.
 * @date 10/4/13
 */

Ext.define('NP.view.vendor.VendorAssignGlAccouns', {
	extend: 'Ext.container.Container',
	alias: 'widget.vendor.vendorassignglaccouns',

	requires: [
		'NP.lib.core.Security',
		'NP.lib.ui.ComboBox',
        'NP.view.shared.GlAccountAssigner'
	],

	padding: 8,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

	// For localization
	title                     : 'Assign GL accounts',

	// Custom options

	initComponent: function() {
		var that = this;

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