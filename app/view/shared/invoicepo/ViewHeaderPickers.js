/**
 * The property and vendor pickers for the invoice/po view page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.ViewHeaderPickers', {
    extend: 'Ext.container.Container',
    alias: 'widget.shared.invoicepo.viewheaderpickers',

    requires: [
    	'NP.lib.core.Config',
        'NP.lib.core.Security',
    	'NP.view.shared.VendorAutoComplete',
    	'NP.view.shared.PropertyCombo',
        'NP.store.property.Properties',
        'NP.store.vendor.Vendors'
    ],

    margin  : '0 16 0 0',
	defaults: {},

    initComponent: function() {
    	var me = this;

    	me.defaults.labelWidth = 120;

    	me.items = [
    		{
                xtype          : 'shared.propertycombo',
                itemId         : 'entityPropertyCombo',
                labelAlign     : 'top',
                allowBlank     : false,
                dependentCombos: ['entityVendorCombo','poview_print_template_id'],
                store          : {
                    type   : 'property.properties',
                    service: 'UserService',
                    action : 'getUserProperties',
                    extraParams: {
                        userprofile_id             : NP.Security.getUser().get('userprofile_id'),
                        delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
                        property_statuses          : '1,-1',
                        includeCodingOnly          : true
                    }
                }
			},{
                xtype        : 'customcombo',
                itemId       : 'entityVendorCombo',
                fieldLabel   : NP.Translator.translate('Vendor') + '<span id="entityVendorSelectOption"> (<a href="#" id="entityVendorSelectBtn">' + NP.Translator.translate('select a vendor') + '</a>)</span>',
                labelAlign   : 'top',
                name         : 'vendor_id',
                valueField   : 'vendor_id',
                displayField : 'vendor_name',
                tpl          : '<tpl for=".">' +
                                    '<li class="x-boundlist-item" role="option">{vendor_name}' +
                                        '<tpl if="NP.Config.getSetting(\'PN.VendorOptions.VendorFavDisplayCode\', \'0\') == 0">' +
                                            ' ({address_city}/{address_zip})' +
                                        '<tpl else>' +
                                            ' ({vendor_id_alt})' +
                                        '</tpl>' +
                                    '</li>' +
                                '</tpl>',
                allowBlank   : false,
                disabled     : true,
                useSmartStore: true,
                store        : {
                    type   : 'vendor.vendors',
                    service: 'VendorService',
                    action : 'getVendorsForInvoice'
                }
			},{
				xtype : 'component',
				itemId: 'vendorDisplay',
				hidden: true
			}
    	];

    	me.callParent(arguments);

        me.addEvents('vendorselectclick');

        me.on('afterrender', function() {
            var el = Ext.get('entityVendorSelectBtn');
            
            if (el) {
                me.mon(el, 'click', function(e) {
                    me.fireEvent('vendorselectclick');
                    e.stopEvent();
                });
            }
        });
    }
});