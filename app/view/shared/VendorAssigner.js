/**
 * Generic component to assign vendors
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.shared.VendorAssigner', {
    extend: 'Ext.ux.form.ItemSelector',
    alias: 'widget.shared.vendorassigner',
    
    fieldLabel: 'Vendors',

    name        : 'vendors',
    displayField: 'vendor_name',
    valueField  : 'vendor_id',
//    tpl         : '<tpl for=".">' +
//                    '<div class="x-boundlist-item">{vendor_name}' +
//                        '<tpl if="vendor_status == "approved"">' +
//                            ' (Approved)' +
//                        '<tpl elseif="vendor_status == "inactive"">' +
//                            ' (Inactive)' +
//                        '</tpl>' +
//                    '</div>' +
//                '</tpl>',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    buttons     : ['add','remove'],
    msgTarget   : 'under',
    
    initComponent: function() {
        if (!this.store) {
            this.store = Ext.create('NP.store.vendor.Vendors', {
					service           : 'VendorService',
					action            : 'getAll',
					autoLoad          : true
			    });
        }

        this.callParent(arguments);
    }
});