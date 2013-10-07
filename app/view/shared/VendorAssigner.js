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
    store       : Ext.create('NP.store.vendor.Vendors', {
					service           : 'VendorService',
					action            : 'getAll',
                                        vendor_status     : 'active',
					autoLoad          : true
			    }),
    tpl         : '<tpl for="."><div class="x-boundlist-item">{vendor_name}</div></tpl>',
    displayField: 'vendor_id',
    valueField  : 'vendor_id',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    buttons     : ['add','remove'],
    msgTarget   : 'under'
});