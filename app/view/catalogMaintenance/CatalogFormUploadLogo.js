/**
 * Catalog Maintenance form to upload a catalog logo
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.CatalogFormUploadLogo', {
    extend: 'Ext.window.Window',
    alias: 'widget.catalogmaintenance.catalogformuploadlogo',
    
    requires: [
        'NP.lib.core.Config',
        'NP.view.shared.button.Cancel',
    	'NP.view.shared.button.Save'
    ],

    layout          : 'fit',
    
    title           : 'Upload Vendor Logo',
    
    width           : 500,
    height          : 380,
    
    modal           : true,
    draggable       : false,
    resizable       : false,
    
    instructionsText: 'Use the form below to upload a vendor logo. You may only upload a .gif .jpeg, .jpg, or .png file type. File dimensions must be less than 90 pixels tall and 400 pixels wide, otherwise file will be automatically re-sized.',
    logoText        : '<b>Current Logo</b>',

    initComponent: function() {
        var that = this;

        this.tbar = [
             { xtype: 'shared.button.cancel' },
             { xtype: 'shared.button.save' }
        ];

        var imgSrc = '';
        var imgHidden = true;
        if (this.vc_logo_filename !== null && this.vc_logo_filename !== '') {
            imgSrc = 'clients/' + NP.lib.core.Config.getAppName() + '/web/images/logos/' + this.vc_logo_filename;
            imgHidden = false;
        }

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
                    name      : 'logo_file',
                    fieldLabel: 'File',
                    width     : 400,
                    allowBlank: false
                },{
                    xtype: 'container',
                    margin: '20 0 0 0',
                    layout: {
                        type: 'vbox',
                        align: 'center'
                    },
                    hidden: imgHidden,
                    items: [
                        {
                            xtype    : 'displayfield',
                            hideLabel: true,
                            value    : this.logoText,
                            flex     : 1
                        },{
                            xtype: 'image',
                            src  : imgSrc,
                            flex : 1
                        },{
                            xtype : 'button',
                            margin: '8 0 0 0',
                            text  : 'Remove',
                            flex  : 1
                        }
                    ]
                }
            ]
        }];

        this.callParent(arguments);
    }
});