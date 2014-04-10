/**
 * Window to help select a vendor
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.vendor.VendorSelectorWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.vendor.vendorselectorwindow',

	requires: [
		'NP.lib.core.Config',
		'NP.view.shared.button.Cancel',
		'NP.view.shared.button.Save',
		'NP.lib.core.Translator',
		'NP.view.shared.SearchByAlphabetButtons'
	],

	layout     : 'fit',
    width      : 800,
    height     : 600,
    border     : false,
    modal      : true,
    minimizable: false,
    autoScroll : true,

    tooltip: 'Select',

    initComponent: function() {
    	var me = this;

        me.title = NP.Translator.translate('Find a Vendor');

        me.tbar = [
            { xtype: 'shared.button.cancel', handler: function() { me.close(); } }
        ];

        me.items = [{
            xtype      : 'form',
            border     : false,
            title      : NP.Translator.translate('Search'),
            layout     : {
                type : 'vbox',
                align: 'stretch'
            },
            items      : [
                {
                	xtype: 'container',
                	layout: {
                		type : 'hbox',
                		align: 'bottom'
                	},
                	margin: 8,
                	defaults: { margin: '0 8 0 0' },
                	items: me.getSearchFields()
                },
	            {
	                xtype: 'shared.searchbyalphabetbuttons',
	                onButton: function(button) {
	                	var letter = button.text;
	                	me.down('[name=keyword]').setValue(letter);
	                	me.runSearch();
	                }

	            },{
					xtype           : 'customgrid',
					title           : NP.Translator.translate('Search Results'),
					paging          : true,
					hidden          : true,
					flex            : 1,
					enableColumnHide: false,
					enableColumnMove: false,
					store           : me.store,
					columns         : [
						{
							xtype  : 'actioncolumn',
							iconCls: 'save-btn',
							tooltip: NP.Translator.translate(me.tooltip),
							width  : 20,
							handler: function(view, rowIndex, colIndex, item, e, rec, row) {
								me.fireEvent('vendorselect', me, rec);
							}
						},{
							text     : NP.Translator.translate('Vendor ID'),
							dataIndex: 'vendor_id_alt',
							flex     : 0.15
						},{
							text     : NP.Translator.translate('Vendor'),
							dataIndex: 'vendor_name',
							flex     : 0.3
						},{
							text     : NP.Translator.translate('Vendor Type'),
							dataIndex: 'vendortype_name',
							flex     : 0.15
						},{
							text     : NP.Translator.translate('Address'),
							dataIndex: 'address_street1',
							flex     : 0.4,
							renderer : function(val, meta, rec) {
								return rec.getAddressHtml();
							} 
						}
					]
                }
            ]
        }];

    	me.callParent(arguments);

    	me.addEvents('vendorselect')
    },

    getSearchFields: function() {
    	var me = this;

    	return [
    		{
				xtype     : 'textfield',
				fieldLabel: NP.Translator.translate('Enter Keyword'),
				labelAlign: 'top',
				name      : 'keyword',
				width     : 350
    		},{
				xtype     : 'radiogroup',
				fieldLabel: NP.Translator.translate('Criteria'),
				labelAlign: 'top',
				layout    : 'hbox',
				items     : [
					{
						boxLabel  : NP.Translator.translate('Begins With'),
						name      : 'criteria',
						inputValue: 'begins',
						checked   : true,
						padding   : '0 15 0 0'
					},{
						boxLabel  : NP.Translator.translate('Contains'),
						name      : 'criteria',
						inputValue: 'contains'
					}
				]
			},{
				xtype  : 'button',
				text   : NP.Translator.translate('Search'),
				handler: function() {
					me.runSearch();
				}
			}
    	];
    },

    runSearch: function() {
    	var me = this;

    	me.store.addExtraParams({
			keyword : me.down('[name=keyword]').getValue(),
			criteria: me.down('radiogroup').getValue().criteria
		});

		me.down('customgrid').show();
		me.store.load();
    }
});