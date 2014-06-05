/**
 * Window for Use Template functionality
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.UseTemplateWindow', {
    extend: 'Ext.window.Window',
    alias:  'widget.shared.invoicepo.usetemplatewindow',

    requires: [
    	'NP.lib.core.Translator',
    	'NP.lib.core.Net',
    	'NP.store.invoice.Invoices',
    	'NP.store.po.Purchaseorders'
    ],

    title      : 'Use Template',
    width      : 800,
    height     : 600,
    bodyPadding: 8,
    modal      : true,
    layout     : {
        type : 'vbox',
        align: 'stretch'
    },

	hideTemplateRemoveBtn: true,
	type                 : null,
	entity_id            : '',
	property_id          : null,
	vendorsite_id        : null,
	utilityaccount_id    : null,

    initComponent: function() {
    	var me = this,
    		pk,
    		templateStore;

    	if (!Ext.Array.contains(['po','invoice'], me.type)) {
    		throw 'The "type" config option must be set to either "invoice" or "po"';
    	}

    	if (me.type == 'invoice') {
			pk            = 'invoice_id';
			templateStore = 'invoice.invoices';
			service       = 'InvoiceService';
    	} else {
			pk            = 'purchaseorder_id';
			templateStore = 'po.purchaseorders';
			service       = 'PoService';
    	}

    	me.title = NP.Translator.translate(me.title);

    	me.tbar = [
	        {
	            xtype: 'shared.button.cancel',
	            text: NP.Translator.translate('Cancel'),
	            listeners: {
	                click: function() {
	                    me.close();
	                }
	            }
	        },{
	            itemId   : 'templateUseBtn',
	            xtype    : 'shared.button.save',
	            text     : NP.Translator.translate('Use'),
	            disabled : true,
	            listeners: {
	                click: function() {
	                	var entity_id = me.down('[name="entity_id"]').getValue();

	                	me.fireEvent('usetemplate', me, entity_id);
	                }
	            }
	        },{
	            itemId   : 'templateRemoveBtn',
	            xtype    : 'shared.button.delete',
	            text     : NP.Translator.translate('Remove Selected Template'),
	            hidden   : me.hideTemplateRemoveBtn,
	            disabled : (me.entity_id == '') ? true : false,
	            listeners: {
	                click: function() {
	                	me.fireEvent('removetemplate', me);
	                }
	            }
	        }
	    ];

	    me.items = [
	        {
	            xtype            : 'customcombo',
	            fieldLabel       : NP.Translator.translate('Choose a template'),
	            name             : 'entity_id',
	            valueField       : pk,
	            displayField     : (me.type == 'invoice') ? 'template_name' : 'purchaseorder_ref',
	            store            : {
	                type       : templateStore,
	                service    : service,
	                action     : 'getTemplatesByCriteria',
	                extraParams : {
	                    'property_id'      : me.property_id,
	                    'vendorsite_id'    : me.vendorsite_id,
	                    'utilityaccount_id': me.utilityaccount_id
	                },
	                autoLoad: true,
	                listeners: {
	                    load: function() {
	                        var combo = me.down('[name="entity_id"]'),
	                            store = combo.getStore(),
	                            rec;

	                        if (me.entity_id != '') {
	                            rec = store.findRecord(pk, me.entity_id);
	                            combo.setValue(rec);
	                            combo.fireEvent('select', combo, [rec]);
	                        }
	                    }
	                }
	            },
	            listeners        : {
	                select: function(combo, recs) {
	                    var panel  = me.down('#entityPrintView'),
	                        useBtn = me.down('#templateUseBtn');

	                    if (recs.length) {
	                        NP.Net.remoteCall({
	                            requests: {
                                    service   : service,
                                    action    : 'getEntityAsHtml',
                                    entity_id : recs[0].get(pk)
                                },
	                            success: function(result) {
	                                panel.update(result);
	                                panel.show();
	                                useBtn.enable();
	                            }
	                        });
	                    } else {
	                        useBtn.disable();
	                        panel.update('');
	                        panel.hide();
	                    }
	                }
	            }
	        },{
	            xtype      : 'panel',
	            itemId     : 'entityPrintView',
	            bodyPadding: 8,
	            hidden     : true,
	            flex       : 1,
	            autoScroll : true,
	            html       : ''
	        }
	    ];

	    me.callParent(arguments);

	    me.addEvents('usetemplate','removetemplate');
    }
});