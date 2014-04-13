/**
 * Generic component to assign vendors
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.shared.VendorAssigner', {
    extend: 'NP.lib.ui.Assigner',
    alias: 'widget.shared.vendorassigner',
    
    fieldLabel: 'Vendors',

    name        : 'glaccount_vendors',
    displayField: 'vendor_name',
    valueField  : 'vendor_id',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    msgTarget   : 'under',
	autoLoad    : true,

	initComponent: function() {
		if (!this.store) {
			this.store = Ext.create('NP.store.vendor.Vendors', {
				service	: 'VendorService',
				action	: 'getAll',
				autoLoad: this.autoLoad,
				fields	: ['vendor_id', 'vendor_name', 'vendor_id_alt']
			});
		}

		this.callParent(arguments);
	}
});