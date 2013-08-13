/**
 * Generic AutoComplete for Vendors
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.VendorAutoComplete', {
    extend: 'NP.lib.ui.AutoComplete',
    alias: 'widget.shared.vendorautocomplete',
    
    requires: ['NP.model.vendor.Vendor'],

    fieldLabel   : 'Vendor',

    name         : 'vendor_id',
    valueField   : 'vendor_id',
    displayField : 'vendor_name',
    width        : 500,
    allowBlank   : false,
    multiSelect  : false,
    minChars     : 1,

    initComponent: function() {
        if (!this.store) {
            this.store = Ext.create('NP.store.vendor.Vendors', {
                            service     : 'VendorService',
                            action      : 'getAll'
                        });
        }

        this.callParent(arguments);
    }
});