Ext.define('NP.view.images.Main', {
    extend: 'Ext.tab.Panel',
    alias:  'widget.images.main',

    title:  'Image Management',

    requires: [
        'NP.view.images.grid.Index',
        'NP.view.images.grid.Invoices',
        'NP.view.images.grid.PurchaseOrders',
        'NP.view.images.grid.Exceptions',
        'NP.view.images.grid.DeletedImages',
    ],

    id: {
        buttonUpload: 'buttonUpload',
        buttonNPISS:  'buttonNPISS',
        buttonNSISS:  'buttonNSISS',

        buttonIndex:             'buttonIndex',
        buttonDelete:            'buttonDelete',
        buttonConvert:           'buttonConvert',
        buttonRevert:            'buttonRevert',
        buttonDeletePermanently: 'buttonDeletePermanently',

        buttonReport: 'buttonReport',
        buttonSearch: 'buttonSearch'
    },
    locale: {
        tabIndex:           'Images to be Indexed',
        tabInvoices:        'Invoices',
        tabPurchaseOrders:  'POs',
        tabExceptions:      'Exceptions',
        tabDeletedImages:   'Deleted Images',

        buttonUpload: 'Upload',
        buttonNPISS:  'NexusPayables Invoice Separator Sheet',
        buttonNSISS:  'Nexus Services Invoice Separator Sheet',

        buttonIndex:             'Index Selected',
        buttonDelete:            'Delete Selected',
        buttonConvert:           'Convert Selected',
        buttonRevert:            'Revert Selected',
        buttonDeletePermanently: 'Permanently Delete Selected',

        buttonReport: 'Report',
        buttonSearch: 'Search Images'
    },

    initComponent: function() {
        this.items = [
            this.tabIndex(),
            this.tabInvoices(),
            this.tabPurchaseOrders(),
            this.tabExceptions(),
            this.tabDeletedImages()
        ];

        this.callParent(arguments);
    },

    tabIndex: function() {
        var tab = {
            id: 'images-index',
            title: this.locale.tabIndex,
            items: [
                {xtype: 'images.grid.Index'}
            ]
        };
        tab.tbar = [
            {xtype: 'button', itemId: this.id.buttonIndex,  text: this.locale.buttonIndex},
            {xtype: 'button', itemId: this.id.buttonDelete, text: this.locale.buttonDelete},

            {xtype: 'tbspacer', width: 20},

            {xtype: 'button', itemId: this.id.buttonUpload, text: this.locale.buttonUpload},
            {xtype: 'button', itemId: this.id.buttonNPISS,  text: this.locale.buttonNPISS},
            {xtype: 'button', itemId: this.id.buttonNSISS,  text: this.locale.buttonNSISS},

            {xtype: 'tbspacer', width: 20},

            {xtype: 'button', itemId: this.id.buttonReport, text: this.locale.buttonReport}
        ]

/*
var state = Ext.ComponentQuery.query('[xtype="shared.contextpicker"]');

tab.items = [
    {
   //                             tab  : 'Indexed',
//				title: 'Images To Be Indexed',

defaultWidth: 50,
        cols: [
            'images.grid.columnview',
            'image.gridcol.ScanDate','image.gridcol.Name','image.gridcol.DocType','image.gridcol.Source'
        ],

        xtype   : 'image.imagegrid',
        selType: 'checkboxmodel',
        selModel: {
            mode: 'MULTI',   // or SINGLE, SIMPLE ... review API for Ext.selection.CheckboxModel
            checkOnly: true    // or false to allow checkbox selection on click anywhere in row
        },
        //itemId  : 'image_grid_index',
	//stateful: true,
	//stateId : 'image_management_index',
	paging  : true,
	store   : Ext.create('NP.store.image.ImageIndexes', {
            service    : 'ImageService',
            action     : 'getImagesToIndex1',
            paging     : true,
            extraParams: {
                //tab                        : 'index', 
		userprofile_id             : NP.Security.getUser().get('userprofile_id'),
		delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
                contextType     : 'all',// state && state[0] ? state[0].getState().type : '',
		contextSelection: ''//state && state[0] ? state[0].getState().selected : ''

            }
        })
        
    }
]

*/

        this.buttonsCommon(tab.tbar);
        return tab;
    },

    tabInvoices: function() {
        var tab = {
            id: 'images-invoices',
            title: this.locale.tabInvoices,
            items: [
                {xtype: 'images.grid.Invoices'}
            ]
        };
        tab.tbar = [
            {xtype: 'button', itemId: this.id.buttonConvert, text: this.locale.buttonConvert},
            {xtype: 'button', itemId: this.id.buttonRevert,  text: this.locale.buttonRevert},
            {xtype: 'button', itemId: this.id.buttonDelete,  text: this.locale.buttonDelete},

            {xtype: 'tbspacer', width: 20},

            {xtype: 'button', itemId: this.id.buttonReport, text: this.locale.buttonReport}
        ];

        this.buttonsCommon(tab.tbar);
        return tab;
    },

    tabPurchaseOrders: function() {
        var tab = {
            id: 'images-purchase-orders',
            title: this.locale.tabPurchaseOrders,
            items: [
                {xtype: 'images.grid.PurchaseOrders'}
            ]
        };
        tab.tbar = [
            {xtype: 'button', itemId: this.id.buttonRevert,  text: this.locale.buttonRevert},
            {xtype: 'button', itemId: this.id.buttonDelete,  text: this.locale.buttonDelete},

            {xtype: 'tbspacer', width: 20},

            {xtype: 'button', itemId: this.id.buttonReport, text: this.locale.buttonReport}
        ];

        this.buttonsCommon(tab.tbar);
        return tab;
    },

    tabExceptions: function() {
        var tab = {
            id: 'images-exceptions',
            title: this.locale.tabExceptions,
            items: [
                {xtype: 'images.grid.Exceptions'}
            ]
        };
        tab.tbar = [
            {xtype: 'button', itemId: this.id.buttonIndex,  text: this.locale.buttonIndex},
            {xtype: 'button', itemId: this.id.buttonDelete, text: this.locale.buttonDelete},

            {xtype: 'tbspacer', width: 20},

            {xtype: 'button', itemId: this.id.buttonReport, text: this.locale.buttonReport}
        ];

        this.buttonsCommon(tab.tbar);
        return tab;
    },

    tabDeletedImages: function() {
        var tab = {
            id: 'images-deleted',
            title: this.locale.tabDeletedImages,
            items: [
                {xtype: 'images.grid.DeletedImages'}
            ]
        };
        tab.tbar = [
            {xtype: 'button', itemId: this.id.buttonRevert,            text: this.locale.buttonRevert},
            {xtype: 'button', itemId: this.id.buttonDeletePermanently, text: this.locale.buttonDeletePermanently},

            {xtype: 'tbspacer', width: 20},
        ];

        this.buttonsCommon(tab.tbar);
        return tab;
    },

    buttonsCommon: function(toolbar) {
        toolbar.push(
            {xtype: 'button', itemId: this.id.buttonSearch, text: this.locale.buttonSearch},
            {xtype: 'tbspacer', flex: 1},
            {xtype: 'shared.contextpicker', itemId: 'imageManagementContextPicker'}
        );
    }
});