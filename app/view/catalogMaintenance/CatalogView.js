/**
 * Catalog Maintenance add/edit form
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.CatalogView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.catalogmaintenance.catalogview',
    
    requires: [
        'NP.view.shared.button.Back',
        'NP.view.shared.button.Edit',
        'NP.view.shared.button.Camera',
        'NP.view.shared.button.Upload',
        'NP.view.shared.button.Activate',
        'NP.view.shared.button.Inactivate',
        'NP.view.shared.PropertyCombo'
    ],

    layout: 'fit',

    autoScroll: true,

    initComponent: function() {
        var that = this;

        var bar = [
            { xtype: 'shared.button.back' },
            { xtype: 'shared.button.edit' },
            { xtype: 'shared.button.camera', text: 'Upload Vendor Logo' },
            { xtype: 'shared.button.upload', text: 'Upload Information PDF' },
            { xtype: 'shared.button.activate', hidden: true },
            { xtype: 'shared.button.inactivate', hidden: true }            
        ];

        this.tbar = bar;
        this.bbar = bar;

        this.callParent(arguments);
    }
});