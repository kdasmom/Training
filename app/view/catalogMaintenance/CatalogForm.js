/**
 * Catalog Maintenance add/edit form
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.CatalogForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.catalogmaintenance.catalogform',
    
    requires: [
        'NP.view.catalogMaintenance.CatalogFormInfo',
        'NP.view.catalogMaintenance.CatalogFormCategories',
        'NP.view.catalogMaintenance.CatalogFormVendors',
        'NP.view.catalogMaintenance.CatalogFormProperties',
        'NP.view.catalogMaintenance.CatalogFormPoSubmission',
        'NP.view.shared.button.Cancel',
    	'NP.view.shared.button.Save',
        'NP.view.shared.button.Camera',
        'NP.view.shared.button.Upload'
    ],

    layout: 'fit',

    autoScroll: true,

    initComponent: function() {
        var that = this;

        var bar = [
             { xtype: 'shared.button.cancel' },
	    	 { xtype: 'shared.button.save' }
	    ];

	    this.tbar = bar;
	    this.bbar = bar;

        this.items = [
            {
                xtype: 'tabpanel',
                bodyPadding: 8,
                deferredRender: false,
                items: [
                    { xtype: 'catalogmaintenance.catalogforminfo' },
                    { xtype: 'catalogmaintenance.catalogformposubmission', hidden: true },
                    { xtype: 'catalogmaintenance.catalogformcategories', hidden: true },
                    { xtype: 'catalogmaintenance.catalogformvendors', hidden: true },
                    { xtype: 'catalogmaintenance.catalogformproperties', hidden: true }
                ] 
            }       
        ];

    	this.callParent(arguments);
    },

    isValid: function() {
        var me = this;

        // Call the standard validation function
        var isValid = this.callParent();

        // Do validation specific to an implementation
        var vc = this.getModel('catalog.Vc');
        var type = Ext.util.Format.capitalize(vc.get('vc_catalogtype'));
        var catalogImpl = Ext.create('NP.view.catalogMaintenance.types.' + type);
        isValid = catalogImpl.isValid(this, vc) && isValid;

        // Check for errors
        var errors = this.findInvalid();

        // If there are errors, make sure the first field is visible
        if (errors.getCount()) {
            errors.getAt(0).ensureVisible();
        }

        return isValid;
    }
});