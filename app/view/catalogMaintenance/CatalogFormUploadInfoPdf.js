/**
 * Catalog Maintenance form to upload a catalog information PDF
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.CatalogFormUploadInfoPdf', {
    extend: 'Ext.window.Window',
    alias: 'widget.catalogmaintenance.catalogformuploadinfopdf',
    
    requires: [
        'NP.lib.core.Config',
        'NP.view.shared.button.Cancel',
    	'NP.view.shared.button.Save'
    ],

    layout          : 'fit',
    
    title           : 'Upload Vendor Logo',
    
    width           : 475,
    height          : 190,
    
    modal           : true,
    draggable       : false,
    resizable       : false,
    
    instructionsText: 'Use the form below to upload a vendor catalog information PDF.',
    logoText        : '<b>Current Logo</b>',

    initComponent: function() {
        var that = this;

        this.tbar = [
             { xtype: 'shared.button.cancel' },
             { xtype: 'shared.button.save' }
        ];

        this.items = [{
            xtype: 'form',
            autoScroll: true,
            border: false,
            bodyPadding: 8,
            items: [
                {
                    xtype: 'displayfield',
                    hideLabel: true,
                    value: this.instructionsText
                },{
                    xtype     : 'filefield',
                    name      : 'pdf_file',
                    fieldLabel: 'File',
                    width     : 400,
                    allowBlank: false
                },{
                	xtype: 'container',
                	layout: {
                		type: 'vbox',
                		align: 'center'
                	},
                	hidden: !this.vc_has_pdf,
                	items: [
                		{
		                    xtype : 'button',
		                    itemId: 'viewCatalogPdfBtn',
		                    margin: '8 0 0 0',
		                    text  : 'View Existing PDF'
		                },{
		                    xtype : 'button',
		                    itemId: 'removeCatalogPdfBtn',
		                    margin: '8 0 0 0',
		                    text  : 'Remove Existing PDF'
		                }
                	]
                }
            ]
        }];

        this.callParent(arguments);
    }
});