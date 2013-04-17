/**
 * Catalog Maintenance: View catalog page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.View', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.catalogmaintenance.view',
    
    requires: [
        'NP.view.shared.button.Back',
        'NP.view.shared.button.Save',
        'NP.view.shared.button.Edit',
        'NP.view.shared.button.Camera',
        'NP.view.shared.button.Upload'
    ],

    title: 'Vendor Catalog',

    vc_id: null,

    html: 'Coming soon...',

    initComponent: function() {
        var that = this;

        var bar = [
             { xtype: 'shared.button.back', text: 'Catalog Maintenance Home' },
             { xtype: 'shared.button.save' },
             { xtype: 'shared.button.edit', text: 'Edit Catalog' },
             { xtype: 'shared.button.camera', text: 'Upload Vendor Logo' },
             { xtype: 'shared.button.upload', text: 'Upload Information PDF' }
        ];

        this.tbar = bar;
        this.bbar = bar;

    	this.callParent(arguments);
    },

    getVcId: function() {
        return this.vc_id;
    }
});