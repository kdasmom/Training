/**
 * Generic component to assign vendors
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.shared.VendorAssigner', {
    extend: 'Ext.ux.form.ItemSelector',
    alias: 'widget.shared.vendorassigner',
    
    fieldLabel: 'Vendors',

    name        : 'glaccount_vendors',
    displayField: 'vendor_name',
    valueField  : 'vendor_id',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    buttons     : ['add','remove'],
    msgTarget   : 'under',
    
    initComponent: function() {
        if (!this.store) {
            this.store = Ext.create('NP.store.vendor.Vendors', {
					service           : 'VendorService',
					action            : 'getAll',
                                        extraParams : {
                                            vendor_status     : 'active'
                                         },
					autoLoad          : true
			    });
        }

        this.callParent(arguments);
    }
});