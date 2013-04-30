/**
 * Catalog Maintenance add/edit form
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.CatalogFormPoSubmission', {
    extend: 'Ext.container.Container',
    alias: 'widget.catalogmaintenance.catalogformposubmission',
    
    requires: [],

    title     : 'Electronic PO Submission',
    
    autoScroll: true,

    defaults: {
        xtype: 'textfield',
        width: 450
    },

    initComponent: function() {
        var that = this;
    	
        this.items = [
            { fieldLabel: 'URL', name: 'vc_posubmit_url' },
            { fieldLabel: 'Username', name: 'vc_posubmit_username' },
            { fieldLabel: 'Password', name: 'vc_posubmit_pwd', inputType: 'password' },
            { fieldLabel: 'From DUNS', name: 'vc_posubmit_from_duns' },
            { fieldLabel: 'To DUNS', name: 'vc_posubmit_to_duns' }
        ];

    	this.callParent(arguments);
    }
});