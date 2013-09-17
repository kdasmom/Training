/**
 * The toolbar for the invoice view page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.ViewToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.invoice.viewtoolbar',

    requires: [
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save',
        'NP.view.shared.button.Delete',
        'NP.view.shared.button.Hourglass',
        'NP.view.shared.button.Upload',
        'NP.view.shared.button.New'
    ],

    // For localization
    
    initComponent: function() {
    	this.items = [
            { xtype: 'shared.button.cancel' },
            { xtype: 'shared.button.save' },
            { text: 'Ready For Processing' },
            { xtype: 'shared.button.delete' },
            { xtype: 'shared.button.hourglass', text: 'Place on Hold' },
            { text: 'Void' },
            { text: 'Optional Workflow' },
            { text: 'Use Template' },
            { text: 'Manage Images' },
            { text: 'Link to PO' },
            '-',
            {
                text: 'Actions',
                menu: [
                    { text: 'Print' },
                    { text: 'Forward' },
                    { text: 'Budget Report' },
                    { text: 'Save as Template' },
                    { text: 'Save as User Template' }
                ]
            },
            '-',
            {
                text: 'Images',
                menu: [
                    { text: 'Upload Image', iconCls: 'upload-btn' },
                    { text: 'View Image' },
                    { text: 'Add Image', iconCls: 'new-btn' }
                ]
            }
        ];

    	this.callParent(arguments);
    }
});